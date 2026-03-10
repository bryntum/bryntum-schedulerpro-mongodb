import { Collection, ObjectId } from 'mongodb';

export const COLLECTIONS = {
    resources    : 'resources',
    events       : 'events',
    assignments  : 'assignments',
    calendars    : 'calendars',
    dependencies : 'dependencies'
} as const;

export type CrudRequestId = string | number;
export type GenericRecord = { _id?: string; [key: string]: any };
export type StoreKey = keyof typeof COLLECTIONS;
export type IdMap = Map<string, string>;
export type IdMaps = Record<StoreKey, IdMap>;
export type Normalizer = (record: GenericRecord) => GenericRecord;

export type StoreChanges = {
    added?: GenericRecord[];
    updated?: GenericRecord[];
    removed?: Array<{ id?: CrudRequestId }>;
};

export type SyncRequestBody = {
    requestId?: CrudRequestId | null;
    resources?: StoreChanges;
    events?: StoreChanges;
    assignments?: StoreChanges;
    calendars?: StoreChanges;
    dependencies?: StoreChanges;
};

export type StoreResponseSection = {
    rows: GenericRecord[];
    removed?: GenericRecord[];
};

export type SyncResponseBody = {
    success: boolean;
    requestId: CrudRequestId | null;
    resources?: StoreResponseSection;
    events?: StoreResponseSection;
    assignments?: StoreResponseSection;
    calendars?: StoreResponseSection;
    dependencies?: StoreResponseSection;
    message?: string;
};

export function createIdMaps(): IdMaps {
    return {
        resources    : new Map(),
        events       : new Map(),
        assignments  : new Map(),
        calendars    : new Map(),
        dependencies : new Map()
    };
}

export function normalizeDate(value: unknown): unknown {
    if (value == null) {
        return value;
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    return value;
}

export function normalizeEventFields(record: GenericRecord): GenericRecord {
    if (!record) {
        return record;
    }

    const normalized = { ...record };

    if ('startDate' in record) {
        normalized.startDate = normalizeDate(record.startDate);
    }

    if ('endDate' in record) {
        normalized.endDate = normalizeDate(record.endDate);
    }

    return normalized;
}

export function resolveId(id: CrudRequestId, map: IdMap): string {
    const asString = String(id);

    return map.get(asString) || asString;
}

export function normalizeAssignmentFields(record: GenericRecord, idMaps: IdMaps): GenericRecord {
    if (!record) {
        return record;
    }

    const eventId = record.eventId ?? record.event;
    const resourceId = record.resourceId ?? record.resource;

    const normalized = {
        ...record
    };

    if (eventId != null) {
        normalized.eventId = resolveId(eventId, idMaps.events);
    }

    if (resourceId != null) {
        normalized.resourceId = resolveId(resourceId, idMaps.resources);
    }

    delete normalized.event;
    delete normalized.resource;

    return normalized;
}

export function normalizeDependencyFields(record: GenericRecord, idMaps: IdMaps): GenericRecord {
    if (!record) {
        return record;
    }

    const fromEvent = record.fromEvent ?? record.from;
    const toEvent = record.toEvent ?? record.to;

    const normalized = {
        ...record
    };

    if (fromEvent != null) {
        normalized.fromEvent = resolveId(fromEvent, idMaps.events);
    }

    if (toEvent != null) {
        normalized.toEvent = resolveId(toEvent, idMaps.events);
    }

    delete normalized.from;
    delete normalized.to;

    return normalized;
}

export function stripInternalFields(record: GenericRecord): GenericRecord {
    if (!record) {
        return record;
    }

    const { _id, ...clean } = record;

    return { ...clean, id : String(_id) };
}

export function collectStoreRows(rows: GenericRecord[]): GenericRecord[] {
    return rows.map(row => stripInternalFields(row));
}

export async function applyStoreChanges({
    collection,
    changes,
    idMap,
    normalizeAdded = value => value,
    normalizeUpdated = value => value
}: {
    collection: Collection<GenericRecord>;
    changes: StoreChanges;
    idMap: IdMap;
    normalizeAdded?: Normalizer;
    normalizeUpdated?: Normalizer;
}): Promise<GenericRecord[]> {
    const rows: GenericRecord[] = [];

    if (Array.isArray(changes.added)) {
        for (const rawRecord of changes.added) {
            const {
                $PhantomId,
                ...data
            } = rawRecord;

            const normalized = normalizeAdded(data);
            const id = String(normalized.id || new ObjectId());
            delete normalized.id;
            const recordToStore = {
                ...normalized,
                _id : id
            };

            await collection.insertOne(recordToStore);

            if ($PhantomId) {
                idMap.set(String($PhantomId), id);
                rows.push({ $PhantomId, id });
            }
            else {
                rows.push({ id });
            }
        }
    }

    if (Array.isArray(changes.updated)) {
        for (const rawRecord of changes.updated) {
            const {
                id,
                ...updatedFields
            } = rawRecord;

            if (!id) {
                continue;
            }

            const normalized = normalizeUpdated(updatedFields);

            await collection.updateOne(
                { _id : String(id) },
                { $set : normalized }
            );
        }
    }

    if (Array.isArray(changes.removed) && changes.removed.length) {
        const ids = changes.removed
            .map(record => record.id)
            .filter(Boolean)
            .map(id => String(id));

        if (ids.length) {
            await collection.deleteMany({
                _id : {
                    $in : ids
                }
            });
        }
    }

    return rows;
}
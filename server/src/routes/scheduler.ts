import { type Request, type Response, Router } from 'express';
import type { Db } from 'mongodb';
import {
    COLLECTIONS,
    applyStoreChanges,
    collectStoreRows,
    createIdMaps,
    normalizeAssignmentFields,
    normalizeDependencyFields,
    normalizeEventFields,
    type GenericRecord,
    type SyncRequestBody,
    type SyncResponseBody
} from '../lib/schedulerCrud.js';

type GetDb = () => Db;

export function createSchedulerRouter(getDb: GetDb): Router {
    const router = Router();

    router.get('/load', async(_req: Request, res: Response) => {
        try {
            const database = getDb();
            const [resources, events, assignments, calendars, dependencies] = await Promise.all([
                database.collection<GenericRecord>(COLLECTIONS.resources).find({}).sort({ neighborhood : 1, floor : 1, name : 1 }).toArray(),
                database.collection<GenericRecord>(COLLECTIONS.events).find({}).sort({ startDate : 1 }).toArray(),
                database.collection<GenericRecord>(COLLECTIONS.assignments).find({}).toArray(),
                database.collection<GenericRecord>(COLLECTIONS.calendars).find({}).toArray(),
                database.collection<GenericRecord>(COLLECTIONS.dependencies).find({}).toArray()
            ]);

            res.json({
                success      : true,
                resources    : { rows : collectStoreRows(resources) },
                events       : { rows : collectStoreRows(events).map(normalizeEventFields) },
                assignments  : { rows : collectStoreRows(assignments) },
                calendars    : { rows : collectStoreRows(calendars) },
                dependencies : { rows : collectStoreRows(dependencies) }
            });
        }
        catch (error) {
            console.error(error);

            res.status(500).json({
                success : false,
                message : 'Could not load workspace scheduler data'
            });
        }
    });

    router.post('/sync', async(req: Request, res: Response) => {
        const {
            requestId,
            resources,
            events,
            assignments,
            calendars,
            dependencies
        } = req.body as SyncRequestBody;

        const idMaps = createIdMaps();

        try {
            const database = getDb();
            const response: SyncResponseBody = {
                success   : true,
                requestId : requestId || null
            };

            if (resources) {
                const rows = await applyStoreChanges({
                    collection : database.collection<GenericRecord>(COLLECTIONS.resources),
                    changes    : resources,
                    idMap      : idMaps.resources
                });

                if (rows.length) {
                    response.resources = { rows };
                }
            }

            if (events) {
                const rows = await applyStoreChanges({
                    collection       : database.collection<GenericRecord>(COLLECTIONS.events),
                    changes          : events,
                    idMap            : idMaps.events,
                    normalizeAdded   : normalizeEventFields,
                    normalizeUpdated : normalizeEventFields
                });

                if (rows.length) {
                    response.events = { rows };
                }
            }

            if (assignments) {
                const rows = await applyStoreChanges({
                    collection : database.collection<GenericRecord>(COLLECTIONS.assignments),
                    changes    : assignments,
                    idMap      : idMaps.assignments,
                    normalizeAdded(record) {
                        return normalizeAssignmentFields(record, idMaps);
                    },
                    normalizeUpdated(record) {
                        return normalizeAssignmentFields(record, idMaps);
                    }
                });

                if (rows.length) {
                    response.assignments = { rows };
                }
            }

            if (calendars) {
                const rows = await applyStoreChanges({
                    collection : database.collection<GenericRecord>(COLLECTIONS.calendars),
                    changes    : calendars,
                    idMap      : idMaps.calendars
                });

                if (rows.length) {
                    response.calendars = { rows };
                }
            }

            if (dependencies) {
                const rows = await applyStoreChanges({
                    collection : database.collection<GenericRecord>(COLLECTIONS.dependencies),
                    changes    : dependencies,
                    idMap      : idMaps.dependencies,
                    normalizeAdded(record) {
                        return normalizeDependencyFields(record, idMaps);
                    },
                    normalizeUpdated(record) {
                        return normalizeDependencyFields(record, idMaps);
                    }
                });

                if (rows.length) {
                    response.dependencies = { rows };
                }
            }

            res.json(response);
        }
        catch (error) {
            console.error(error);

            res.status(500).json({
                success   : false,
                requestId : requestId || null,
                message   : 'Could not sync workspace scheduler data'
            } satisfies SyncResponseBody);
        }
    });

    return router;
}
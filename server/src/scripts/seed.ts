import { loadEnv } from '../lib/loadEnv.js';
import { createMongoClient } from '../lib/mongo.js';

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'workspace_scheduler2';

const client = createMongoClient(MONGODB_URI);

type GenericRecord = Record<string, unknown>;

const resources: GenericRecord[] = [
    {
        _id           : 'room-terrace',
        name          : 'Terrace Briefing Room',
        workspaceType : 'Meeting room',
        neighborhood  : 'Docklands',
        floor         : 'Level 2',
        capacity      : 8,
        maxUnits      : 100,
        city          : 'Cape Town',
        amenities     : 'Display wall, VC bar'
    },
    {
        _id           : 'room-harbor',
        name          : 'Harbor Strategy Suite',
        workspaceType : 'Meeting room',
        neighborhood  : 'Harbor Wing',
        floor         : 'Level 5',
        capacity      : 16,
        maxUnits      : 100,
        city          : 'Cape Town',
        amenities     : 'Board table, dual screens'
    },
    {
        _id           : 'room-sprint',
        name          : 'Sprint Garage',
        workspaceType : 'Meeting room',
        neighborhood  : 'Atrium North',
        floor         : 'Level 3',
        capacity      : 6,
        maxUnits      : 100,
        city          : 'Cape Town',
        amenities     : 'Whiteboards, pin-up wall'
    },
    {
        _id           : 'desk-orbit-1',
        name          : 'Orbit Desk Bank A',
        workspaceType : 'Desk bank',
        neighborhood  : 'Docklands',
        floor         : 'Level 4',
        capacity      : 6,
        maxUnits      : 180,
        city          : 'Cape Town',
        amenities     : 'Sit-stand desks, lockers'
    },
    {
        _id           : 'desk-orbit-2',
        name          : 'Orbit Desk Bank B',
        workspaceType : 'Desk bank',
        neighborhood  : 'Docklands',
        floor         : 'Level 4',
        capacity      : 6,
        maxUnits      : 180,
        city          : 'Cape Town',
        amenities     : 'Phone booths, lockers'
    },
    {
        _id           : 'desk-focus',
        name          : 'Focus Pods',
        workspaceType : 'Desk bank',
        neighborhood  : 'Atrium North',
        floor         : 'Level 2',
        capacity      : 4,
        maxUnits      : 140,
        city          : 'Cape Town',
        amenities     : 'Quiet zone, task lights'
    },
    {
        _id           : 'coworking-canvas',
        name          : 'Canvas Coworking Lounge',
        workspaceType : 'Coworking lounge',
        neighborhood  : 'Harbor Wing',
        floor         : 'Ground',
        capacity      : 24,
        maxUnits      : 300,
        city          : 'Cape Town',
        amenities     : 'Cafe seating, soft booths'
    },
    {
        _id           : 'coworking-sky',
        name          : 'Skyline Lounge',
        workspaceType : 'Coworking Lounge',
        neighborhood  : 'Atrium North',
        floor         : 'Rooftop',
        capacity      : 18,
        maxUnits      : 260,
        city          : 'Cape Town',
        amenities     : 'Outdoor tables, power rails'
    }
];

const events: GenericRecord[] = [
    {
        _id             : 'booking-1',
        name            : 'Weekly launch review',
        bookingCategory : 'Meeting',
        host            : 'Ava',
        team            : 'Product',
        attendees       : 7,
        notes           : 'Mirror a client-facing property review flow with no overlaps.',
        startDate       : '2026-03-16T08:30:00',
        endDate         : '2026-03-16T11:30:00'
    },
    {
        _id             : 'booking-2',
        name            : 'Quiet desk block',
        bookingCategory : 'Desk',
        host            : 'Jules',
        team            : 'Growth',
        attendees       : 5,
        notes           : 'Focus time for a temporary landing team.',
        startDate       : '2026-03-16T09:00:00',
        endDate         : '2026-03-16T17:00:00'
    },
    {
        _id             : 'booking-3',
        name            : 'Sales deal room',
        bookingCategory : 'Meeting',
        host            : 'Maya',
        team            : 'Sales',
        attendees       : 12,
        notes           : 'Large suite booking for end-of-quarter negotiations.',
        startDate       : '2026-03-16T11:00:00',
        endDate         : '2026-03-16T14:00:00'
    },
    {
        _id             : 'booking-4',
        name            : 'Design sprint desks',
        bookingCategory : 'Desk',
        host            : 'Niko',
        team            : 'Design',
        attendees       : 6,
        notes           : 'Desk bank reserved as one inventory block.',
        startDate       : '2026-03-17T08:00:00',
        endDate         : '2026-03-17T18:00:00'
    },
    {
        _id             : 'booking-5',
        name            : 'Founder coffee session',
        bookingCategory : 'Coworking',
        host            : 'Lebo',
        team            : 'Community',
        attendees       : 14,
        notes           : 'Shared-capacity lounge booking with flexible units.',
        startDate       : '2026-03-17T10:00:00',
        endDate         : '2026-03-17T13:00:00'
    },
    {
        _id             : 'booking-6',
        name            : 'Board prep workshop',
        bookingCategory : 'Meeting',
        host            : 'Dylan',
        team            : 'Operations',
        attendees       : 5,
        notes           : 'Smaller room blocked for a prep workshop.',
        startDate       : '2026-03-17T11:30:00',
        endDate         : '2026-03-17T14:30:00'
    },
    {
        _id             : 'booking-7',
        name            : 'Product all-hands overflow',
        bookingCategory : 'Coworking',
        host            : 'Rae',
        team            : 'Product',
        attendees       : 20,
        notes           : 'Lounge used as shared overflow for team gathering.',
        startDate       : '2026-03-18T09:00:00',
        endDate         : '2026-03-18T12:00:00'
    },
    {
        _id             : 'booking-8',
        name            : 'Engineering hot-desk rotation',
        bookingCategory : 'Desk',
        host            : 'Theo',
        team            : 'Engineering',
        attendees       : 4,
        notes           : 'Desk cluster reserved to mirror a rotating occupancy block.',
        startDate       : '2026-03-18T08:00:00',
        endDate         : '2026-03-18T16:00:00'
    }
];

const assignments: GenericRecord[] = [
    { _id : 'assign-1', eventId : 'booking-1', resourceId : 'room-terrace', units : 100 },
    { _id : 'assign-2', eventId : 'booking-2', resourceId : 'desk-orbit-1', units : 80 },
    { _id : 'assign-3', eventId : 'booking-3', resourceId : 'room-harbor', units : 100 },
    { _id : 'assign-4', eventId : 'booking-4', resourceId : 'desk-orbit-2', units : 100 },
    { _id : 'assign-5', eventId : 'booking-5', resourceId : 'coworking-canvas', units : 55 },
    { _id : 'assign-6', eventId : 'booking-6', resourceId : 'room-sprint', units : 100 },
    { _id : 'assign-7', eventId : 'booking-7', resourceId : 'coworking-sky', units : 70 },
    { _id : 'assign-8', eventId : 'booking-8', resourceId : 'desk-focus', units : 65 }
];

const calendars: GenericRecord[] = [
    {
        _id       : 'workspace-hours',
        name      : 'Workspace Hours',
        intervals : [
            {
                recurrentStartDate : 'every weekday at 07:00',
                recurrentEndDate   : 'every weekday at 20:00',
                isWorking          : true
            }
        ]
    }
];

const dependencies: GenericRecord[] = [
    { _id : 'dep-1', fromEvent : 'booking-1', toEvent : 'booking-6' },
    { _id : 'dep-2', fromEvent : 'booking-4', toEvent : 'booking-8' },
    { _id : 'dep-3', fromEvent : 'booking-5', toEvent : 'booking-7' }
];

async function seed(): Promise<void> {
    await client.connect();

    const db = client.db(MONGODB_DB);
    const collectionNames = ['resources', 'events', 'assignments', 'calendars', 'dependencies'];

    await Promise.all(collectionNames.map(name => db.collection(name).deleteMany({})));
    await db.collection('resources').insertMany(resources);
    await db.collection('events').insertMany(events);
    await db.collection('assignments').insertMany(assignments);
    await db.collection('calendars').insertMany(calendars);
    await db.collection('dependencies').insertMany(dependencies);

    console.log(`Seeded ${MONGODB_DB} with workspace scheduler data.`);

    await client.close();
}

void seed().catch(error => {
    console.error(error);
    process.exit(1);
});
import express from 'express';
import { type Db } from 'mongodb';
import cors from './lib/cors.js';
import { loadEnv } from './lib/loadEnv.js';
import { createMongoClient } from './lib/mongo.js';
import { createSchedulerRouter } from './routes/scheduler.js';

loadEnv();

const PORT = Number(process.env.PORT || 1339);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'workspace_scheduler2';

const app = express();
app.use(cors({
    origin : FRONTEND_URL
}));
app.use(express.json({ limit : '2mb' }));

const client = createMongoClient(MONGODB_URI);
let db: Db | undefined;

function getDb(): Db {
    if (!db) {
        throw new Error('Database connection is not ready yet');
    }

    return db;
}

app.use('/api', createSchedulerRouter(getDb));

async function start(): Promise<void> {
    await client.connect();
    db = client.db(MONGODB_DB);
    console.log(`MongoDB ready for database "${MONGODB_DB}"`);

    app.listen(PORT, () => {
        console.log(`Workspace Scheduler server running on http://localhost:${PORT}`);
    });
}

start().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
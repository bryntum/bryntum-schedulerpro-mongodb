import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import path from 'node:path';

export function loadEnv(): void {
    const candidates = [
        path.resolve(process.cwd(), '.env'),
        path.resolve(process.cwd(), '../.env')
    ];

    const envPath = candidates.find(existsSync);

    if (envPath) {
        dotenv.config({ path : envPath });
        return;
    }

    dotenv.config();
}
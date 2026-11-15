import type { MigrationConfig } from 'drizzle-orm/migrator';

import "dotenv/config";

function envOrThrow(key: string): string {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }

    return value;
}

export type APIConfig = {
    fileserverHits: number;
    port: number;
    platform: string;
    polkaKey: string;
};

export type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
}

export const config = {
    api: {
        fileserverHits: 0,
        port: Number(envOrThrow('PORT')),
        platform: envOrThrow('PLATFORM'),
        polkaKey: envOrThrow('POLKA_KEY'),
    },
    db: {
        url: envOrThrow('DB_URL'),
        migrationConfig: {
            migrationsFolder: './src/db/migrations',
        },
    },
    jwtSecret: envOrThrow('JWT_SECRET'),
};

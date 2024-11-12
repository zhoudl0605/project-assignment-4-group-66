/**
 * Database module
 * @module DatabaseModule
 *
 * This module is a singleton that is used to interact with the database
 * It will use the MongoDB library to connect to the database
 */

import { MongoClient } from "mongodb";

type DatabaseConfig = {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
};

export class DatabaseModule {
    private static instance: DatabaseModule;
    private config: DatabaseConfig;
    private client: MongoClient | undefined;

    private constructor() {
        // Initialize the database connection configuration
        this.config = DatabaseModule.getConfig();
    }

    /**
     * Get the singleton instance of the database module
     */
    public static getInstance(): DatabaseModule {
        if (!DatabaseModule.instance) {
            DatabaseModule.instance = new DatabaseModule();
        }
        return DatabaseModule.instance;
    }

    /**
     * Connect to the database if not already connected
     */
    public async connect(): Promise<MongoClient> {
        if (this.client) return this.client;

        const { host, port, username, password, database } = this.config;
        const encodedUser = encodeURIComponent(username);
        const encodedPass = encodeURIComponent(password);
        const url = `mongodb://${encodedUser}:${encodedPass}@${host}:${port}/${database}?authSource=admin`;

        this.client = new MongoClient(url);

        try {
            await this.client.connect();
            console.log("Database connection established successfully");
        } catch (err) {
            console.error("Database connection failed", err);
            throw new Error("Failed to connect to the database");
        }

        return this.client;
    }

    /**
     * Close the database connection
     */
    public async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.close();
            this.client = undefined;
            console.log("Database connection closed");
        }
    }

    /**
     * Test the database connection
     */
    public async testConnection(): Promise<boolean> {
        try {
            await this.connect();
            return true;
        } catch (err) {
            console.error("Database connection test failed:", err);
            return false;
        }
    }

    /**
     * Load and return the database configuration
     */
    public static getConfig(): DatabaseConfig {
        return {
            host: process.env.DB_HOST || "localhost",
            port: parseInt(process.env.DB_PORT || "27017"),
            username: process.env.DB_USER || "",
            password: process.env.DB_PASSWORD || "",
            database: process.env.DB_DATABASE || "test",
        };
    }
}

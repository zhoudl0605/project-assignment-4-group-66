import mongoose, { ConnectOptions } from "mongoose";

type DatabaseConfig = {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    options?: ConnectOptions | undefined;
    authSource: string;
};

export class DatabaseModule {
    private static instance: DatabaseModule;
    private config: DatabaseConfig;

    private constructor() {
        this.config = DatabaseModule.getConfig();
    }

    /**
     * 获取DatabaseModule单例实例
     */
    public static getInstance(): DatabaseModule {
        if (!DatabaseModule.instance) {
            DatabaseModule.instance = new DatabaseModule();
        }
        return DatabaseModule.instance;
    }

    /**
     * 连接数据库，如果已连接则返回当前连接
     */
    public async connect(): Promise<typeof mongoose> {
        if (mongoose.connection.readyState) {
            return mongoose;
        }

        const {
            host,
            port,
            username,
            password,
            database,
            options,
            authSource,
        } = this.config;
        const encodedUser = encodeURIComponent(username);
        const encodedPass = encodeURIComponent(password);
        const uri = `mongodb://${encodedUser}:${encodedPass}@${host}:${port}/${database}?authSource=${authSource}`;

        try {
            await mongoose.connect(uri, options);
            console.log("Database connection established successfully");
        } catch (err) {
            console.error("Database connection failed", err);
            throw new Error("Failed to connect to the database");
        }

        return mongoose;
    }

    /**
     * 断开数据库连接
     */
    public async disconnect(): Promise<void> {
        if (mongoose.connection.readyState) {
            try {
                await mongoose.disconnect();
                console.log("Database connection closed");
            } catch (err) {
                console.error("Failed to close the database connection", err);
            }
        }
    }

    /**
     * 测试数据库连接
     */
    public async testConnection(): Promise<boolean> {
        try {
            await this.connect();
            console.log("Database connection is working");
            return true;
        } catch (error) {
            console.error("Database connection test failed", error);
            return false;
        }
    }

    /**
     * 加载并返回数据库配置
     */
    public static getConfig(): DatabaseConfig {
        return {
            host: process.env.DB_HOST || "localhost",
            port: parseInt(process.env.DB_PORT || "27017"),
            username: process.env.DB_USER || "",
            password: process.env.DB_PASSWORD || "",
            database: process.env.DB_DATABASE || "test",
            options: {
                connectTimeoutMS: 5000,
            },
            authSource: process.env.DB_AUTH_SOURCE || "admin",
        };
    }
}

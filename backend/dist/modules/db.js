"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class DatabaseModule {
    constructor() {
        this.config = DatabaseModule.getConfig();
    }
    /**
     * 获取DatabaseModule单例实例
     */
    static getInstance() {
        if (!DatabaseModule.instance) {
            DatabaseModule.instance = new DatabaseModule();
        }
        return DatabaseModule.instance;
    }
    /**
     * 连接数据库，如果已连接则返回当前连接
     */
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (mongoose_1.default.connection.readyState) {
                return mongoose_1.default;
            }
            const { host, port, username, password, database, options, authSource, } = this.config;
            const encodedUser = encodeURIComponent(username);
            const encodedPass = encodeURIComponent(password);
            const uri = `mongodb://${encodedUser}:${encodedPass}@${host}:${port}/${database}?authSource=${authSource}`;
            try {
                yield mongoose_1.default.connect(uri, options);
                console.log("Database connection established successfully");
            }
            catch (err) {
                console.error("Database connection failed", err);
                throw new Error("Failed to connect to the database");
            }
            return mongoose_1.default;
        });
    }
    /**
     * 断开数据库连接
     */
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (mongoose_1.default.connection.readyState) {
                try {
                    yield mongoose_1.default.disconnect();
                    console.log("Database connection closed");
                }
                catch (err) {
                    console.error("Failed to close the database connection", err);
                }
            }
        });
    }
    /**
     * 测试数据库连接
     */
    testConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connect();
                console.log("Database connection is working");
                return true;
            }
            catch (error) {
                console.error("Database connection test failed", error);
                return false;
            }
        });
    }
    /**
     * 加载并返回数据库配置
     */
    static getConfig() {
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
exports.DatabaseModule = DatabaseModule;

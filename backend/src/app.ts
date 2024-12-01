// Import necessary modules
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import { errorHandler } from "./middlewares/errorHandler"; // 保留自定义错误处理中间件
import { DatabaseModule } from "./modules/db";
import { Context, Next } from "koa";
import { registerRoutes } from "./routes";

async function main() {
    const app = express();

    // Set up database connection
    const db = DatabaseModule.getInstance();
    if (!(await db.testConnection())) {
        process.exit(1);
    }

    // Set up CORS
    app.use(
        cors({
            origin: "http://localhost:3000", // 允许的前端地址
            credentials: true, // 是否允许携带 Cookie
            methods: ["GET", "POST", "PUT", "DELETE"], // 允许的 HTTP 方法
            allowedHeaders: ["Content-Type", "Authorization"], // 允许的 HTTP 头
        })
    );

    // Parse request bodies
    app.use(bodyParser.json()); // JSON 解析
    app.use(bodyParser.urlencoded({ extended: true })); // URL 编码解析

    // SSL configuration
    let server;
    if (process.env.NODE_ENV === "production") {
        const options = {
            key: fs.readFileSync("/etc/ssl/private/ece9065_ssl.key"),
            cert: fs.readFileSync("/etc/ssl/certs/ece9065_ssl.crt"),
        };
        server = require("https").createServer(options, app);
    } else {
        server = require("http").createServer(app);
    }

    // Apply custom error handler
    app.use(
        (
            err: any,
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            errorHandler(err, req, res, next);
        }
    );

    app.use(express.json());
    // Register routes
    registerRoutes(app); // 假设 `registerRoutes` 会根据 Express 注册路由

    // Start the server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Run the application
main().catch((err) => {
    console.error("Error occurred:", err);
    process.exit(1);
});

export default main;

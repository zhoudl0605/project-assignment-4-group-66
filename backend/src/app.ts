// Import necessary modules
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.DATABASE_HOST);

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import { errorHandler } from "./middlewares/errorHandler";
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
            origin: (origin, callback) => {
                if (
                    !origin ||
                    origin.startsWith("http://localhost") ||
                    origin.startsWith("http://127.0.0.1")
                ) {
                    callback(null, true);
                } else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
        })
    );

    // Parse request bodies
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

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
    registerRoutes(app);

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

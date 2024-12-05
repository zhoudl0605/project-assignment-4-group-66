import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import cookieParser from "cookie-parser";
// @ts-ignore
import xssClean from "xss-clean";
// @ts-ignore
import csrf from "csurf";
import { errorHandler } from "./middlewares/errorHandler";
import { DatabaseModule } from "./modules/db";
import { registerRoutes } from "./routes";

async function main() {
    const app = express();

    // Database Connection
    const db = DatabaseModule.getInstance();
    if (!(await db.testConnection())) {
        process.exit(1);
    }

    // CORS
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
            allowedHeaders: ["Content-Type", "Authorization", "CSRF-Token"],
        })
    );

    // XSS Protection
    app.use(xssClean());

    // Body Parsers
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Cookie Parser & CSRF Protection
    app.use(cookieParser());
    app.use(csrf({ cookie: true }));
    app.use((req: any, res: any, next: any) => {
        res.cookie("XSRF-TOKEN", req.csrfToken()); // CSRF Token in cookie
        res.locals.csrfToken = req.csrfToken(); // CSRF Token for views
        next();
    });

    // Example route to get CSRF Token
    app.get("/csrf-token", (req: any, res: Response) => {
        res.json({ csrfToken: req.csrfToken() });
    });

    // SSL Configuration (Production)
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

    // Register Routes
    registerRoutes(app);

    // Global Error Handler
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        if (err.code === "EBADCSRFTOKEN") {
            res.status(403).json({ message: "Invalid CSRF Token" });
        } else {
            errorHandler(err, req, res, next);
        }
    });

    // Start Server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

main().catch((err) => {
    console.error("Error occurred:", err);
    process.exit(1);
});

export default main;

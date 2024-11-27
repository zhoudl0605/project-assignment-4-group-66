// Import necessary modules
import Koa from "koa";
// import logger from "koa-logger";
import bodyParser from "koa-bodyparser";
import { errorHandler } from "./middlewares/errorHandler";
import { registerRoutes } from "./routes";
import { DatabaseModule } from "./modules/db";
import cors from "@koa/cors";

async function main() {
    const app = new Koa();

    // Set up database connection
    const db = DatabaseModule.getInstance();
    if (!(await db.testConnection())) {
        process.exit(1);
    }

    // set up cors
    app.use(
        cors({
            origin: "http://localhost:3000", // 允许的前端地址
            credentials: true, // 是否允许携带 Cookie
            allowMethods: ["GET", "POST", "PUT", "DELETE"], // 允许的 HTTP 方法
            allowHeaders: ["Content-Type", "Authorization"], // 允许的 HTTP 头
        })
    );

    // Apply middlewares
    app.use(errorHandler); // Global error handler
    app.use(bodyParser()); // Parse request bodies

    // Register routes
    registerRoutes(app);

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default main;

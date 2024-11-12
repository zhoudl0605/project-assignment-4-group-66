// Import necessary modules
import Koa from "koa";
// import logger from "koa-logger";
import bodyParser from "koa-bodyparser";
import { errorHandler } from "./middlewares/errorHandler";
import { registerRoutes } from "./routes";
import { DatabaseModule } from "./modules/db";

async function main() {
    const app = new Koa();

    // Set up database connection
    const db = DatabaseModule.getInstance();
    if (!(await db.testConnection())) {
        process.exit(1);
    }
    console.log("Database connection established successfully");

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

// src/index.ts

// Step 1: Load environment variables (this should be the first step)
import dotenv from "dotenv";
dotenv.config();

// Check required environment variables
if (!process.env.PORT) {
    console.log("PORT is missing in the .env, using default PORT 3000");
}

// Import necessary modules
import Koa from "koa";
// import logger from "koa-logger";
import bodyParser from "koa-bodyparser";
import { errorHandler } from "./src/middlewares/errorHandler";
import { registerRoutes } from "./src/routes";

async function main() {
    const app = new Koa();

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

// Run the application
main().catch((err) => {
    console.error("Failed to start the server:", err);
});

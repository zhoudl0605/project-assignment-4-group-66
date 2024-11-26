// src/index.ts

// Step 1: Load environment variables (this should be the first step)
import dotenv from "dotenv";
import main from "./src/app";
dotenv.config();

// Run the application
main().catch((err) => {
    console.error("Error occurred:", err);
    process.exit(1);
});

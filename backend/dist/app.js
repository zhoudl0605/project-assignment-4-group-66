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
// Import necessary modules
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const koa_1 = __importDefault(require("koa"));
// import logger from "koa-logger";
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const errorHandler_1 = require("./middlewares/errorHandler");
const routes_1 = require("./routes");
const db_1 = require("./modules/db");
const cors_1 = __importDefault(require("@koa/cors"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = new koa_1.default();
        // Set up database connection
        const db = db_1.DatabaseModule.getInstance();
        if (!(yield db.testConnection())) {
            process.exit(1);
        }
        // set up cors
        app.use((0, cors_1.default)({
            origin: "http://localhost:3000", // 允许的前端地址
            credentials: true, // 是否允许携带 Cookie
            allowMethods: ["GET", "POST", "PUT", "DELETE"], // 允许的 HTTP 方法
            allowHeaders: ["Content-Type", "Authorization"], // 允许的 HTTP 头
        }));
        // Apply middlewares
        app.use(errorHandler_1.errorHandler); // Global error handler
        app.use((0, koa_bodyparser_1.default)()); // Parse request bodies
        // Register routes
        (0, routes_1.registerRoutes)(app);
        // Start the server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    });
}
// Run the application
main().catch((err) => {
    console.error("Error occurred:", err);
    process.exit(1);
});
exports.default = main;

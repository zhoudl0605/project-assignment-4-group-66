"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const authController_1 = require("../controllers/authController");
const authRouter = new koa_router_1.default({
    prefix: "/auth",
});
authRouter.post("/login", authController_1.AuthController.loginController);
authRouter.post("/signup", authController_1.AuthController.signupController);
exports.default = authRouter;

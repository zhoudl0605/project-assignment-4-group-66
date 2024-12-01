import express from "express";
import { AuthController } from "../controllers/authController";

const authRouter = express.Router();
// 登录路由
authRouter.post("/login", (req, res, next) => {
    AuthController.loginController(req, res, next);
});

// 注册路由
authRouter.post("/signup", (req, res, next) => {
    AuthController.signupController(req, res, next);
});

export default authRouter;

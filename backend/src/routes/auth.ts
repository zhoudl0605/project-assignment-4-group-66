import express from "express";
import { AuthController } from "../controllers/authController";

const authRouter = express.Router();
authRouter.post("/login", (req, res, next) => {
    AuthController.loginController(req, res, next);
});

authRouter.post("/signup", (req, res, next) => {
    AuthController.signupController(req, res, next);
});

export default authRouter;

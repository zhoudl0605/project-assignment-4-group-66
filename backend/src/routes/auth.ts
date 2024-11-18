import Router from "koa-router";
import { AuthController } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const authRouter = new Router({
    prefix: "/auth",
});

authRouter.post("/login", AuthController.loginController);
authRouter.post("/signup", authMiddleware, AuthController.signupController);

export default authRouter;

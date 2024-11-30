import Router from "koa-router";
import { AuthController } from "../controllers/authController";

const authRouter = new Router({
    prefix: "/auth",
});

authRouter.post("/login", AuthController.loginController);
authRouter.post("/signup", AuthController.signupController);

export default authRouter;

import App from "koa";
import Router from "koa-router";
import { AuthController } from "../controllers/auth";

const authRouter = new Router({
    prefix: "/auth",
});

authRouter.post("/login", AuthController.loginController);
authRouter.post("/signup", AuthController.signupController);


export default authRouter;

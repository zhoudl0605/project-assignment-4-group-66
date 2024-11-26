import { Context, Next } from "koa";
import { auth } from "../modules/auth";

export async function authMiddleware(ctx: Context, next: Next) {
    // check if request has authorization header
    if (!ctx.headers.authorization) {
        ctx.status = 401;
        ctx.body = {
            status: "error",
            message: "Unauthorized",
        };
        return;
    }

    // get token from authorization header
    const token = ctx.headers.authorization.split(" ")[1];
    // verify token
    const decodedToken = await auth.verifyToken(token);
    // set user in context
    ctx.user = decodedToken;

    await next();
}

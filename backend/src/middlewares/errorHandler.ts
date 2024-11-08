// src/middlewares/errorHandler.ts
import { Context, Next } from "koa";

export async function errorHandler(ctx: Context, next: Next) {
    try {
        await next();
    } catch (err) {
        if (err instanceof Error) {
            ctx.status = (err as any).status || 500;
            ctx.body = { error: err.message || "Internal Server Error" };
            console.error("Error occurred:", err);
        } else {
            ctx.status = 500;
            ctx.body = { error: "Internal Server Error" };
            console.error("Unknown error occurred:", err);
        }
        console.error("Error occurred:", err);
    }
}

// src/middlewares/errorHandler.ts
import { Context, Next } from "koa";
import { RequestErrorResponse } from "../types";

export async function errorHandler(ctx: Context, next: Next) {
    try {
        await next();
    } catch (err: any) {
        ctx.status = 500;
        ctx.body = {
            status: "error",
            message: "Internal Server Error",
        } as RequestErrorResponse;

        console.error("Error occurred:", err);
    }
}

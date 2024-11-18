import { UserService } from "../services/user";
import { RequestErrorResponse, RequestSuccessResponse } from "../types";

export class UsersController {
    public static async getUsersController(ctx: any) {
        const limit = parseInt(ctx.query.limit) || 10; // 从查询参数中获取limit，默认为10
        const skip = parseInt(ctx.query.skip) || 0; // 从查询参数中获取skip，默认为0

        try {
            const userService = new UserService();
            const result = await userService.getUsers(limit, skip);

            // 返回成功响应
            ctx.status = 200;
            ctx.body = {
                status: "success",
                result,
            };
        } catch (error: any) {
            console.error("Error while getting users:", error.toString());

            // 返回错误响应
            ctx.status = 500;
            ctx.body = {
                status: "error",
                message: "Internal server error",
            };
        }
    }

    public static async getUserController(ctx: any) {
        const body = ctx.request.body;
        const id = ctx.params.id;

        try {
            const userService = new UserService();
            const user = await userService.getUserById(id);

            if (!user) {
                ctx.status = 404;
                return (ctx.body = {
                    status: "fail",
                    message: "User not found",
                }) as RequestErrorResponse;
            }

            return (ctx.body = {
                status: "success",
                data: user,
            }) as RequestSuccessResponse;
        } catch (error: any) {
            console.error("Error while getting user:", error.toString());

            ctx.status = 500;
            return (ctx.body = {
                status: "error",
                message: "Internal server error",
            }) as RequestErrorResponse;
        }
    }

    public static async updateUserController(ctx: any) {
        const body = ctx.request.body;
        const id = ctx.params.id;

        try {
            const userService = new UserService();
            const user = await userService.updateUser(id, body);

            if (!user) {
                ctx.status = 404;
                return (ctx.body = {
                    status: "fail",
                    message: "User not found",
                }) as RequestErrorResponse;
            }

            return (ctx.body = {
                status: "success",
                data: user,
            }) as RequestSuccessResponse;
        } catch (error: any) {
            console.error("Error while updating user:", error.toString());

            ctx.status = 500;
            return (ctx.body = {
                status: "error",
                message: "Internal server error",
            }) as RequestErrorResponse;
        }
    }
}

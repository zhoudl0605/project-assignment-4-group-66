import { UserService } from "../services/userService";
import { RequestErrorResponse, RequestSuccessResponse } from "../types";

export class UsersController {
    public static async getUsersController(ctx: any) {
        const limit = parseInt(ctx.query.limit) || 100; 
        const skip = parseInt(ctx.query.skip) || 0; 

        try {
            const userService = new UserService();
            const result = await userService.getUsers(limit, skip);

            ctx.status = 200;
            ctx.body = {
                status: "success",
                result,
            };
        } catch (error: any) {
            console.error("Error while getting users:", error.toString());

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

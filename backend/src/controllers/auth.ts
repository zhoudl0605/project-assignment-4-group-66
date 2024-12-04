import { UserService } from "../services/userService";
import { RequestErrorResponse, RequestSuccessResponse } from "../types";

export class AuthController {
    public static async signupController(ctx: any) {
        const body = ctx.request.body;

        const name = body.name;
        const email = body.email;
        const password = body.password;
        const role = body.role || "user";

        try {
            const userService = new UserService();
            const user = await userService.createUser(
                name,
                email,
                password,
                role
            );

            // create JWT token
            const token = await userService.generateToken(user);

            return (ctx.body = {
                status: "success",
                data: {
                    token,
                },
            } as RequestSuccessResponse);
        } catch (error: any) {
            console.error("Error while creating user", error.toString());
            // handle duplicate email error
            if (error.message.includes("duplicate key error", "email")) {
                ctx.status = 400;
                ctx.body = {
                    status: "error",
                    message: "Email already exists",
                } as RequestErrorResponse;
                return;
            }

            ctx.status = 500;
            ctx.body = {
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse;

            return;
        }
    }

    public static async loginController(ctx: any) {
        const body = ctx.request.body;
        const email = body.email;
        const password = body.password;
        const role = body.role || "user";

        try {
            const userService = new UserService();
            const user = await userService.userLogin(email, password, role);

            if (!user) {
                ctx.status = 401;
                ctx.body = {
                    status: "error",
                    message: "Invalid email or password",
                } as RequestErrorResponse;
                return;
            }

            const token = await userService.generateToken(user);

            return (ctx.body = {
                status: "success",
                data: {
                    token,
                },
            } as RequestSuccessResponse);
        } catch (error: any) {
            console.error("Error while logging in user", error.toString());
            ctx.status = 500;
            ctx.body = {
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse;
            return;
        }
    }
}

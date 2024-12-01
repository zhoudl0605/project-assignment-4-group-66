import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user";
import { RequestErrorResponse, RequestSuccessResponse } from "../types";

export class AuthController {
    private static sendErrorResponse(
        res: Response,
        statusCode: number,
        message: string
    ) {
        return res.status(statusCode).json({
            status: "error",
            message,
        } as RequestErrorResponse);
    }

    public static async signupController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { name, email, password, role = "user", address } = req.body;
            const userService = new UserService();
            const user = await userService.createUser(
                name,
                email,
                password,
                role,
                address
            );

            const token = await userService.generateToken(user);
            res.status(201).json({
                status: "success",
                data: { token },
            });
        } catch (error: any) {
            console.error(`[AuthController][Signup] Error: ${error.message}`);

            if (error.message.includes("duplicate key error", "email")) {
                return this.sendErrorResponse(res, 400, "Email already exists");
            }

            return this.sendErrorResponse(res, 500, "Internal server error");
        }
    }

    public static async loginController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { email, password, role = "user" } = req.body;
            const userService = new UserService();
            const user = await userService.userLogin(email, password, role);

            if (!user) {
                return res.status(401).json({
                    status: "error",
                    message: "Invalid email or password",
                });
            }

            const token = await userService.generateToken(user);

            res.status(200);
            res.setHeader("Authorization", `Bearer ${token}`);
            res.json({
                status: "success",
                data: { token },
            });
        } catch (error: any) {
            console.error(`[AuthController][Login] Error: ${error.message}`);
            return this.sendErrorResponse(res, 500, "Internal server error");
        }
    }
}

import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/userService";
import { RequestErrorResponse, RequestSuccessResponse } from "../types";
import { UserDao } from "../dao/user";

export class UsersController {
    // 获取用户列表
    public static async getUsersController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const limit = parseInt(req.query.limit as string) || 10; // 从查询参数中获取 limit，默认为10
        const skip = parseInt(req.query.skip as string) || 0; // 从查询参数中获取 skip，默认为0

        try {
            const userService = new UserService();
            const result = await userService.getUsers(limit, skip);

            // 返回成功响应
            return res.status(200).json({
                status: "success",
                result,
            });
        } catch (error: any) {
            console.error("Error while getting users:", error.toString());

            // 返回错误响应
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }

    // 根据 ID 获取用户
    public static async getUserController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const id = req.params.id;

        try {
            const userService = new UserService();
            const user = await userService.getUserById(id);

            return res.status(200).json({
                status: "success",
                data: user,
            } as RequestSuccessResponse);
        } catch (error: any) {
            console.error("Error while getting user:", error.toString());

            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse);
        }
    }

    // 更新用户信息
    public static async updateUserController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const body = req.body;
        const id = req.params.id;

        try {
            const userService = new UserService();
            const user = await userService.updateUser(id, body);

            if (!user) {
                return res.status(404).json({
                    status: "fail",
                    message: "User not found",
                } as RequestErrorResponse);
            }

            return res.status(200).json({
                status: "success",
                data: user,
            } as RequestSuccessResponse);
        } catch (error: any) {
            console.error("Error while updating user:", error.toString());

            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse);
        }
    }

    public static async deleteUserController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const id = req.params.id;

        try {
            const userService = new UserService();
            const user = await userService.deleteUser(id);

            if (!user) {
                return res.status(404).json({
                    status: "fail",
                    message: "User not found",
                } as RequestErrorResponse);
            }

            return res.status(200).json({
                status: "success",
                data: user,
            } as RequestSuccessResponse);
        } catch (error: any) {
            console.error("Error while deleting user:", error.toString());

            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse);
        }
    }
}

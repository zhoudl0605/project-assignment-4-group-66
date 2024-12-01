import { NextFunction, Request, Response } from "express";
import { UserRole } from "../models/user";
import { OrderService } from "../services/orderService";
import { ShoppingCartService } from "../services/shoppingCart";
import { RequestErrorResponse, RequestSuccessResponse } from "../types";
import { auth } from "../modules/auth";

export class OrdersController {
    // 获取订单
    public static async getOrdersController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const body = req.body;
        const limit = body.limit || 10;
        const skip = body.skip || 0;

        const token = req.headers.authorization!;
        const user = await auth.verifyToken(token);
        let userId = body.userId;

        if (user?.role !== UserRole.ADMIN) {
            userId = user?._id;
        }

        const orderService = new OrderService();

        try {
            const orders = await orderService.getOrders(userId, limit, skip);

            return res.status(200).json({
                status: "success",
                ...orders,
            } as RequestSuccessResponse);
        } catch (error: any) {
            console.error("Error while getting orders:", error.toString());
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse);
        }
    }

    // 创建订单
    public static async postOrderController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const body = req.body;
        const shoppingCartId = body.shoppingCartId;

        const token = req.headers.authorization!;
        const user = await auth.verifyToken(token);

        const orderService = new OrderService();
        const shoppingCartService = new ShoppingCartService();

        try {
            const shoppingCart = await shoppingCartService.getShoppingCartById(
                shoppingCartId
            );

            if (!shoppingCart) {
                return res.status(404).json({
                    status: "error",
                    message: "Shopping cart not found",
                } as RequestErrorResponse);
            }

            const order = await orderService.createOrder(
                user?._id,
                body.products
            );

            return res.status(201).json({
                status: "success",
                data: order,
            } as RequestSuccessResponse);
        } catch (error: any) {
            console.error("Error while creating order:", error.toString());
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse);
        }
    }
}

import { NextFunction, Request, Response } from "express";
import { UserRole } from "../models/user";
import { OrderService } from "../services/orderService";
import { ShoppingCartService } from "../services/shoppingCart";
import { RequestErrorResponse, RequestSuccessResponse } from "../types";
import { auth } from "../modules/auth";

export class OrdersController {
    public static async getOrdersController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const query = req.query;
        const limit = parseInt(query.limit as string) || 10;
        const skip = parseInt(query.skip as string) || 0;

        let bearertoken = req.headers.authorization;
        let token = bearertoken?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized",
            } as RequestErrorResponse);
        }

        const user = await auth.verifyToken(token);
        let userId = query.userId as string | null;

        if (user?.role !== UserRole.ADMIN) {
            userId = user?._id;
        }

        const orderService = new OrderService();

        try {
            const orders = await orderService.getOrders(userId, limit, skip);

            return res.status(200).json({
                status: "success",
                data: orders,
            } as RequestSuccessResponse);
        } catch (error: any) {
            console.error("Error while getting orders:", error.toString());
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse);
        }
    }

    public static async postOrderController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const { products } = req.body; // 从客户端获取商品列表
        let bearertoken = req.headers.authorization;
        let token = bearertoken?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized",
            } as RequestErrorResponse);
        }

        const user = await auth.verifyToken(token);

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized",
            } as RequestErrorResponse);
        }

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "Invalid or empty products array",
            } as RequestErrorResponse);
        }

        const orderService = new OrderService();

        try {
            for (const product of products) {
                if (
                    !product.productId ||
                    typeof product.productId !== "string" ||
                    !product.quantity ||
                    typeof product.quantity !== "number" ||
                    product.quantity <= 0
                ) {
                    return res.status(400).json({
                        status: "error",
                        message: "Invalid product data",
                    } as RequestErrorResponse);
                }
            }

            const order = await orderService.createOrder(user._id, products);

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

    public static async getOrderByIdController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const id = req.params.id;

        let bearertoken = req.headers.authorization;
        let token = bearertoken?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized",
            } as RequestErrorResponse);
        }

        const user = await auth.verifyToken(token);

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized",
            } as RequestErrorResponse);
        }

        const orderService = new OrderService();

        try {
            const order = await orderService.getOrderById(id);

            if (!order) {
                return res.status(404).json({
                    status: "error",
                    message: "Order not found",
                } as RequestErrorResponse);
            }

            if (
                user.role !== UserRole.ADMIN &&
                order.userId.toString() !== user._id.toString()
            ) {
                return res.status(403).json({
                    status: "error",
                    message: "Forbidden",
                } as RequestErrorResponse);
            }

            return res.status(200).json({
                status: "success",
                data: order,
            } as RequestSuccessResponse);
        } catch (error: any) {
            console.error("Error while fetching order:", error.toString());
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse);
        }
    }

    public static async updateOrderController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const id = req.params.id;
        const body = req.body;

        let bearertoken = req.headers.authorization;
        let token = bearertoken?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized",
            } as RequestErrorResponse);
        }

        const user = await auth.verifyToken(token);

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized",
            } as RequestErrorResponse);
        }

        const orderService = new OrderService();

        try {
            const order = await orderService.getOrderById(id);

            if (!order) {
                return res.status(404).json({
                    status: "error",
                    message: "Order not found",
                } as RequestErrorResponse);
            }

            if (
                user.role !== UserRole.ADMIN &&
                order.userId.toString() !== user._id.toString()
            ) {
                return res.status(403).json({
                    status: "error",
                    message: "Forbidden",
                } as RequestErrorResponse);
            }

            const updatedOrder = await orderService.updateOrder(id, body);

            return res.status(200).json({
                status: "success",
                data: updatedOrder,
            } as RequestSuccessResponse);
        } catch (error: any) {
            console.error("Error while updating order:", error.toString());
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse);
        }
    }

    public static async deleteOrderController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const id = req.params.id;

        let bearertoken = req.headers.authorization;
        let token = bearertoken?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized",
            } as RequestErrorResponse);
        }

        const user = await auth.verifyToken(token);

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized",
            } as RequestErrorResponse);
        }

        const orderService = new OrderService();

        try {
            const order = await orderService.getOrderById(id);

            if (!order) {
                return res.status(404).json({
                    status: "error",
                    message: "Order not found",
                } as RequestErrorResponse);
            }

            if (
                user.role !== UserRole.ADMIN &&
                order.userId.toString() !== user._id.toString()
            ) {
                return res.status(403).json({
                    status: "error",
                    message: "Forbidden",
                } as RequestErrorResponse);
            }

            await orderService.deleteOrder(id);

            return res.status(200).json({
                status: "success",
                message: "Order deleted successfully",
            });
        } catch (error: any) {
            console.error("Error while deleting order:", error.toString());
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse);
        }
    }
}

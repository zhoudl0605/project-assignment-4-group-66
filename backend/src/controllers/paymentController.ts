import { Request, Response, NextFunction } from "express";
import { PaymentMethodService } from "../services/paymentMethodService";
import { auth } from "../modules/auth";
import { OrderService } from "../services/orderService";

export class PaymentController {
    /**
     * 支付订单
     */
    static async postPaymentMethod(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            let bearertoken = req.headers.authorization;
            let token = bearertoken?.split(" ")[1];
            if (!token) {
                return res.status(401).json({
                    status: "error",
                    message: "Unauthorized",
                });
            }

            const user = await auth.verifyToken(token);
            if (!user) {
                return res.status(401).json({
                    status: "error",
                    message: "Unauthorized",
                });
            }

            let {
                cardType,
                cardNumber,
                cardName,
                expirationDate,
                cvv,
                paymentMethodId,
                orderId,
            } = req.body;

            let paymentMethod;
            if (paymentMethodId) {
                const paymentMethodService = new PaymentMethodService();
                paymentMethod = await paymentMethodService.getPaymentMethodById(
                    paymentMethodId
                );
                if (!paymentMethod) {
                    return res.status(404).json({
                        status: "error",
                        message: "Payment method not found",
                    });
                }
            } else {
                // 数据校验
                if (
                    !cardType ||
                    !cardNumber ||
                    !cardName ||
                    !expirationDate ||
                    !cvv
                ) {
                    return res.status(400).json({
                        status: "error",
                        message: "Missing required fields",
                    });
                }

                // 调用服务层
                const paymentMethodService = new PaymentMethodService();
                paymentMethod = await paymentMethodService.createPaymentMethod({
                    userId: user._id,
                    cardType,
                    cardNumber,
                    cardName,
                    expirationDate,
                    cvv,
                });
            }

            let success = true; // simulate success payment
            if (!success) {
                return res.status(400).json({
                    status: "error",
                    message: "Payment failed",
                });
            }

            const orderService = new OrderService();
            const order = await orderService.getOrderById(orderId);
            if (!order) {
                return res.status(404).json({
                    status: "error",
                    message: "Order not found",
                });
            }
            await orderService.payOrder(orderId);

            return res.status(201).json({
                status: "success",
            });
        } catch (error: any) {
            console.error("Error in postPaymentMethod:", error.message);
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }
}

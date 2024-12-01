import { Request, Response, NextFunction } from "express";
import { PaymentMethodService } from "../services/paymentMethodService";
import { auth } from "../modules/auth";

export class PaymentController {
    /**
     * 创建支付方式
     */
    static async postPaymentMethod(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({
                    status: "error",
                    message: "Unauthorized",
                });
            }

            // 验证用户身份
            const user = await auth.verifyToken(token);
            if (!user) {
                return res.status(401).json({
                    status: "error",
                    message: "Unauthorized",
                });
            }

            const {
                cardType,
                cardNumber,
                cardName,
                expirationDate,
                cvv,
                paymentMethodId,
            } = req.body;

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
            const newPaymentMethod =
                await paymentMethodService.createPaymentMethod({
                    userId: user._id,
                    cardType,
                    cardNumber,
                    cardName,
                    expirationDate,
                    cvv,
                });

            return res.status(201).json({
                status: "success",
                data: newPaymentMethod,
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

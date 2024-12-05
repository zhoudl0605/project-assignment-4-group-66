import { NextFunction, Request, Response } from "express";
import { auth } from "../modules/auth";
import { UserRole } from "../models/user";
import { PaymentMethodService } from "../services/paymentMethodService";
import { RequestErrorResponse } from "../types";

export class PaymentMethodsController {
    static async getPaymentMethods(
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
            });
        }

        const user = await auth.verifyToken(token);
        let userId = query.userId;

        if (user?.role !== UserRole.ADMIN) {
            userId = user?._id;
        }

        const paymentMethodService = new PaymentMethodService();

        try {
            const paymentMethods = await paymentMethodService.getPaymentMethods(
                userId as string,
                query
            );

            return res.status(200).json({
                status: "success",
                data: paymentMethods,
            });
        } catch (error: any) {
            console.error(
                "Error while getting payment methods:",
                error.toString()
            );
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }

    static async postPaymentMethod(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const body = req.body;
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

        let targetUserId = body.userId;
        if (user.role !== UserRole.ADMIN) {
            targetUserId = user._id;
        }

        const paymentMethodService = new PaymentMethodService();

        try {
            const paymentMethod =
                await paymentMethodService.createPaymentMethod({
                    ...body,
                    userId: targetUserId, 
                });

            const errors = paymentMethod.validateSync();
            if (errors) {
                console.error(
                    "Error while validating payment method:",
                    errors.message
                );

                return res.status(400).json({
                    status: "error",
                    message: errors.message,
                } as RequestErrorResponse);
            }

            await paymentMethod.save();

            return res.status(201).json({
                status: "success",
                data: paymentMethod,
            });
        } catch (error: any) {
            console.error(
                "Error while creating payment method:",
                error.toString()
            );
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }

    static async getPaymentMethodById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const id = req.params.id;
        const paymentMethodService = new PaymentMethodService();

        try {
            const paymentMethod =
                await paymentMethodService.getPaymentMethodById(id);

            return res.status(200).json({
                status: "success",
                data: paymentMethod,
            });
        } catch (error: any) {
            console.error(
                "Error while fetching payment method by ID:",
                error.toString()
            );
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }

    static async updatePaymentMethod(
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
            });
        }

        const user = await auth.verifyToken(token);
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized",
            });
        }

        const paymentMethodService = new PaymentMethodService();

        try {
            const paymentMethod =
                await paymentMethodService.getPaymentMethodById(id);

            if (!paymentMethod) {
                return res.status(404).json({
                    status: "error",
                    message: "Payment method not found",
                });
            }

            if (
                user.role !== UserRole.ADMIN &&
                paymentMethod.userId.toString() !== user._id.toString()
            ) {
                return res.status(403).json({
                    status: "error",
                    message: "Forbidden",
                });
            }

            const updatedPaymentMethod =
                await paymentMethodService.updatePaymentMethod(id, body);

            return res.status(200).json({
                status: "success",
                data: updatedPaymentMethod,
            });
        } catch (error: any) {
            console.error(
                "Error while updating payment method:",
                error.toString()
            );
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }

    static async deletePaymentMethod(
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
            });
        }

        const user = await auth.verifyToken(token);
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized",
            });
        }

        const paymentMethodService = new PaymentMethodService();

        try {
            const paymentMethod =
                await paymentMethodService.getPaymentMethodById(id);

            if (!paymentMethod) {
                return res.status(404).json({
                    status: "error",
                    message: "Payment method not found",
                });
            }

            if (
                user.role !== UserRole.ADMIN &&
                paymentMethod.userId.toString() !== user._id.toString()
            ) {
                return res.status(403).json({
                    status: "error",
                    message: "Forbidden",
                });
            }

            const deletedPaymentMethod =
                await paymentMethodService.deletePaymentMethod(id);

            return res.status(200).json({
                status: "success",
                data: deletedPaymentMethod,
            });
        } catch (error: any) {
            console.error(
                "Error while deleting payment method:",
                error.toString()
            );
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }
}

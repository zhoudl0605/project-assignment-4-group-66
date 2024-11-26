import { UserRole } from "../models/user";
import { OrderService } from "../services/OrderService";
import { ShoppingCartService } from "../services/shoppingCart";
import { RequestErrorResponse, RequestSuccessResponse } from "../types";

export class OrdersController {
    public static async getOrdersController(ctx: any) {
        // check if the role is admin print all orders
        const body = ctx.request.body;
        const user = ctx.state.user;
        const limit = body.limit;
        const skip = body.skip;
        let userId = body.userId;
        if (user.role != UserRole.ADMIN) {
            userId = user._id;
        }

        const orderService = new OrderService();
        try {
            let orders = await orderService.getOrders(userId, limit, skip);

            return (ctx.body = {
                status: "success",
                ...orders,
            }) as RequestSuccessResponse;
        } catch (error: any) {
            console.error("Error while getting orders", error.toString());
            ctx.status = 500;
            ctx.body = {
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse;
            return;
        }
    }

    // public static async postOrderController(ctx: any) {
    //     const body = ctx.request.body;
    //     const user = ctx.state.user;
    //     const shoppingCartId = body.shoppingCartId;

    //     const orderService = new OrderService();
    //     const shoppingCartService = new ShoppingCartService();
    //     try {
    //         const shoppingCart = await shoppingCartService.getShoppingCartByUserId(
    //             shoppingCartId
    //         );

    //         if (!shoppingCart) {
    //             ctx.status = 404;
    //             ctx.body = {
    //                 status: "error",
    //                 message: "Shopping cart not found",
    //             } as RequestErrorResponse;
    //             return;
    //         }

    //         const order = await orderService.createOrder(
    //             user._id,
    //             body.products
    //         );

    //         return (ctx.body = {
    //             status: "success",
    //             data: order,
    //         }) as RequestSuccessResponse;
    //     } catch (error: any) {
    //         console.error("Error while creating order", error.toString());
    //         ctx.status = 500;
    //         ctx.body = {
    //             status: "error",
    //             message: "Internal server error",
    //         } as RequestErrorResponse;
    //         return;
    //     }
    // }
}

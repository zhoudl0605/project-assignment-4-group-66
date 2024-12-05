import { NextFunction, Request, Response } from "express";
import { ShoppingCartService } from "../services/shoppingCart";
import { RequestErrorResponse, RequestSuccessResponse } from "../types";

export class ShoppingCartController {
    public static async getShoppingCartController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const id = req.params.id;

        try {
            const shoppingCartService = new ShoppingCartService();
            const shoppingCart = await shoppingCartService.getShoppingCartById(
                id
            );

            return res.status(200).json({
                status: "success",
                data: shoppingCart,
            });
        } catch (error: any) {
            console.error(
                `[ShoppingCartController][getShoppingCart] Error: ${error}`
            );
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }

    public static async postShoppingCartController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const id = req.params.id;
        const body = req.body;

        try {
            const shoppingCartService = new ShoppingCartService();
            let shoppingCart = await shoppingCartService.getShoppingCartById(
                id
            );

            if (!shoppingCart) {
                return res.status(404).json({
                    status: "fail",
                    message: "Shopping cart not found",
                } as RequestErrorResponse);
            }

            const bodyProducts = body.products;
            const result = await shoppingCartService.updateShoppingCartItems(
                id,
                bodyProducts
            );
            shoppingCart = result!;

            return res.status(200).json({
                status: "success",
                data: shoppingCart,
            });
        } catch (error: any) {
            console.error(
                `[ShoppingCartController][postShoppingCart] Error: ${error}`
            );
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }

    public static async clearShoppingCartController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const id = req.params.id;

        try {
            const shoppingCartService = new ShoppingCartService();
            const shoppingCart = await shoppingCartService.getShoppingCartById(
                id
            );

            if (!shoppingCart) {
                return res.status(404).json({
                    status: "fail",
                    message: "Shopping cart not found",
                } as RequestErrorResponse);
            }

            const result = await shoppingCartService.clearShoppingCart(id);

            return res.status(200).json({
                status: "success",
                data: result,
            } as RequestSuccessResponse);
        } catch (error: any) {
            console.error(
                `[ShoppingCartController][clearShoppingCart] Error: ${error}`
            );
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }

    public static async putShoppingCartController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const id = req.params.id;
        const body = req.body;

        try {
            const shoppingCartService = new ShoppingCartService();
            let shoppingCart = await shoppingCartService.getShoppingCartById(
                id
            );

            if (!shoppingCart) {
                return res.status(404).json({
                    status: "fail",
                    message: "Shopping cart not found",
                });
            }

            const newProducts = body.products;

            for (const newProduct of newProducts) {
                const existingProduct = shoppingCart.products.find(
                    (p: any) => p.productId === newProduct.productId
                );

                if (existingProduct) {
                    existingProduct.quantity = newProduct.quantity;
                } else {
                    shoppingCart.products.push(newProduct);
                }
            }

            const updatedCart =
                await shoppingCartService.updateShoppingCartItems(
                    id,
                    shoppingCart.products
                );

            return res.status(200).json({
                status: "success",
                data: updatedCart,
            });
        } catch (error: any) {
            console.error(
                `[ShoppingCartController][putShoppingCart] Error: ${error}`
            );
            return res.status(400).json({
                status: "fail",
                message: error.toString(),
            } as RequestErrorResponse);
        }
    }

    public static async deleteShoppingCartItemController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const id = req.params.id;
        const productId = req.params.productId;

        try {
            const shoppingCartService = new ShoppingCartService();
            const shoppingCart = await shoppingCartService.getShoppingCartById(
                id
            );

            if (!shoppingCart) {
                return res.status(404).json({
                    status: "fail",
                    message: "Shopping cart not found",
                });
            }

            const updatedProducts = shoppingCart.products.filter(
                (p: any) => p.productId !== productId
            );

            const updatedCart =
                await shoppingCartService.updateShoppingCartItems(
                    id,
                    updatedProducts
                );

            return res.status(200).json({
                status: "success",
                data: updatedCart,
            });
        } catch (error: any) {
            console.error(
                `[ShoppingCartController][deleteShoppingCartItem] Error: ${error}`
            );
            return res.status(400).json({
                status: "fail",
                message: error.toString(),
            } as RequestErrorResponse);
        }
    }
}

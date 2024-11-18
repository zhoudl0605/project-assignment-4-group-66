import { ShoppingCartService } from "../services/shoppingCart";
import { RequestErrorResponse, RequestSuccessResponse } from "../types";

export class ShoppingCartController {
    public static async getShoppingCartController(ctx: any) {
        const id = ctx.params.id;

        const shoppingCartService = new ShoppingCartService();
        const shoppingCart = await shoppingCartService.getShoppingCartById(id);

        return (ctx.body = {
            status: "success",
            data: shoppingCart,
        });
    }

    public static async postShoppingCartController(ctx: any) {
        const id = ctx.params.id;
        const body = ctx.request.body;

        const shoppingCartService = new ShoppingCartService();
        let shoppingCart = await shoppingCartService.getShoppingCartById(id);
        if (!shoppingCart) {
            return (ctx.body = {
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

        return (ctx.body = {
            status: "success",
            data: shoppingCart,
        });
    }

    public static async clearShoppingCartController(ctx: any) {
        const id = ctx.params.id;

        const shoppingCartService = new ShoppingCartService();
        const shoppingCart = await shoppingCartService.getShoppingCartById(id);

        if (!shoppingCart) {
            return (ctx.body = {
                status: "fail",
                message: "Shopping cart not found",
            } as RequestErrorResponse);
        }

        const result = await shoppingCartService.clearShoppingCart(id);

        return (ctx.body = {
            status: "success",
            data: result,
        } as RequestSuccessResponse);
    }

    public static async putShoppingCartController(ctx: any) {
        const id = ctx.params.id;
        const body = ctx.request.body;

        const shoppingCartService = new ShoppingCartService();
        let shoppingCart = await shoppingCartService.getShoppingCartById(id);

        let newProducts = body.products;
        // check if the new products are already in the shopping cart
        for (const newProduct of newProducts) {
            const existingProduct = shoppingCart.products.find(
                (p: any) => p.productId === newProduct.productId
            );

            // if so, update the quantity
            if (existingProduct) {
                existingProduct.quantity = newProduct.quantity;
            } else {
                shoppingCart.products.push(newProduct);
            }
        }

        try {
            const shoppingCart =
                await shoppingCartService.updateShoppingCartItems(
                    id,
                    newProducts
                );

            return (ctx.body = {
                status: "success",
                data: shoppingCart,
            });
        } catch (error: any) {
            ctx.status = 400;
            return (ctx.body = {
                status: "fail",
                message: error.toString(),
            } as RequestErrorResponse);
        }
    }

    public static async deleteShoppingCartItemController(ctx: any) {
        const id = ctx.params.id;
        const productId = ctx.params.productId;

        const shoppingCartService = new ShoppingCartService();
        let shoppingCart = await shoppingCartService.getShoppingCartById(id);

        const products = shoppingCart.products.find(
            (p: any) => p.productId != productId
        );

        console.log(products);

        try {
            const result = await shoppingCartService.updateShoppingCartItems(
                id,
                products
            );
            shoppingCart = result!;

            return (ctx.body = {
                status: "success",
                data: shoppingCart,
            });
        } catch (error: any) {
            ctx.status = 400;
            return (ctx.body = {
                status: "fail",
                message: error.toString(),
            } as RequestErrorResponse);
        }
    }
}

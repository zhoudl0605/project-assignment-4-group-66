"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingCartController = void 0;
const shoppingCart_1 = require("../services/shoppingCart");
class ShoppingCartController {
    static getShoppingCartController(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = ctx.params.id;
            const shoppingCartService = new shoppingCart_1.ShoppingCartService();
            const shoppingCart = yield shoppingCartService.getShoppingCartById(id);
            return (ctx.body = {
                status: "success",
                data: shoppingCart,
            });
        });
    }
    static postShoppingCartController(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = ctx.params.id;
            const body = ctx.request.body;
            const shoppingCartService = new shoppingCart_1.ShoppingCartService();
            let shoppingCart = yield shoppingCartService.getShoppingCartById(id);
            if (!shoppingCart) {
                return (ctx.body = {
                    status: "fail",
                    message: "Shopping cart not found",
                });
            }
            const bodyProducts = body.products;
            const result = yield shoppingCartService.updateShoppingCartItems(id, bodyProducts);
            shoppingCart = result;
            return (ctx.body = {
                status: "success",
                data: shoppingCart,
            });
        });
    }
    static clearShoppingCartController(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = ctx.params.id;
            const shoppingCartService = new shoppingCart_1.ShoppingCartService();
            const shoppingCart = yield shoppingCartService.getShoppingCartById(id);
            if (!shoppingCart) {
                return (ctx.body = {
                    status: "fail",
                    message: "Shopping cart not found",
                });
            }
            const result = yield shoppingCartService.clearShoppingCart(id);
            return (ctx.body = {
                status: "success",
                data: result,
            });
        });
    }
    static putShoppingCartController(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = ctx.params.id;
            const body = ctx.request.body;
            const shoppingCartService = new shoppingCart_1.ShoppingCartService();
            let shoppingCart = yield shoppingCartService.getShoppingCartById(id);
            let newProducts = body.products;
            // check if the new products are already in the shopping cart
            for (const newProduct of newProducts) {
                const existingProduct = shoppingCart.products.find((p) => p.productId === newProduct.productId);
                // if so, update the quantity
                if (existingProduct) {
                    existingProduct.quantity = newProduct.quantity;
                }
                else {
                    shoppingCart.products.push(newProduct);
                }
            }
            try {
                const shoppingCart = yield shoppingCartService.updateShoppingCartItems(id, newProducts);
                return (ctx.body = {
                    status: "success",
                    data: shoppingCart,
                });
            }
            catch (error) {
                ctx.status = 400;
                return (ctx.body = {
                    status: "fail",
                    message: error.toString(),
                });
            }
        });
    }
    static deleteShoppingCartItemController(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = ctx.params.id;
            const productId = ctx.params.productId;
            const shoppingCartService = new shoppingCart_1.ShoppingCartService();
            let shoppingCart = yield shoppingCartService.getShoppingCartById(id);
            const products = shoppingCart.products.find((p) => p.productId != productId);
            console.log(products);
            try {
                const result = yield shoppingCartService.updateShoppingCartItems(id, products);
                shoppingCart = result;
                return (ctx.body = {
                    status: "success",
                    data: shoppingCart,
                });
            }
            catch (error) {
                ctx.status = 400;
                return (ctx.body = {
                    status: "fail",
                    message: error.toString(),
                });
            }
        });
    }
}
exports.ShoppingCartController = ShoppingCartController;

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
exports.ShoppingCartDao = void 0;
const shoppingCart_1 = require("../models/shoppingCart");
class ShoppingCartDao {
    getShoppingCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // get shopping cart from database
            let cart = yield shoppingCart_1.ShoppingCartModel.findOne({
                userId,
            });
            if (!cart) {
                // create a new shopping cart if not found
                cart = new shoppingCart_1.ShoppingCartModel({
                    userId,
                    products: [],
                });
                yield cart.save();
            }
            return cart;
        });
    }
    updateShoppingCartItems(userId, products) {
        return __awaiter(this, void 0, void 0, function* () {
            // add product to shopping cart
            const opts = { new: true, runValidators: true };
            const cart = shoppingCart_1.ShoppingCartModel.findOneAndUpdate({ userId }, {
                $set: {
                    products,
                },
            }, opts);
            return cart;
        });
    }
    addProductToShoppingCart(userId, productId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            // add product to shopping cart
            const opts = { new: true, runValidators: true };
            const cart = shoppingCart_1.ShoppingCartModel.findOneAndUpdate({ userId }, {
                $push: {
                    products: [
                        {
                            productId,
                            quantity,
                        },
                    ],
                },
            }, opts);
            return cart;
        });
    }
    removeProductFromShoppingCart(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            // remove product from shopping cart
            shoppingCart_1.ShoppingCartModel.findOneAndUpdate({ userId }, { $pull: { products: productId, updatedAt: new Date() } });
            return;
        });
    }
    clearShoppingCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // clear shopping cart
            const opts = { new: true, runValidators: true };
            return shoppingCart_1.ShoppingCartModel.findOneAndUpdate({ userId }, {
                $set: {
                    products: [],
                    updatedAt: new Date(),
                },
            }, opts);
        });
    }
}
exports.ShoppingCartDao = ShoppingCartDao;

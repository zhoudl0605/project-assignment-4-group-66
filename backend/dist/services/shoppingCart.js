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
exports.ShoppingCartService = void 0;
const shoppingCart_1 = require("../dao/shoppingCart");
class ShoppingCartService {
    constructor() {
        this.shoppingCartDao = new shoppingCart_1.ShoppingCartDao();
    }
    getShoppingCartById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.shoppingCartDao.getShoppingCart(userId);
        });
    }
    updateShoppingCartItems(userId, products) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.shoppingCartDao.updateShoppingCartItems(userId, products);
        });
    }
    addProductToShoppingCart(userId, productId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.shoppingCartDao.addProductToShoppingCart(userId, productId, quantity);
        });
    }
    clearShoppingCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.shoppingCartDao.clearShoppingCart(userId);
        });
    }
    removeProductFromShoppingCart(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            let shoppingCart = yield this.getShoppingCartById(userId);
            let products = shoppingCart.products.filter((product) => product.productId.toString() !== productId);
            return yield this.shoppingCartDao.updateShoppingCartItems(userId, products);
        });
    }
}
exports.ShoppingCartService = ShoppingCartService;

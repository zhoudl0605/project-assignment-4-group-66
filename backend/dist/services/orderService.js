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
exports.OrderService = void 0;
const order_1 = require("../dao/order");
class OrderService {
    constructor() {
        this.orderDao = new order_1.OrderDao();
    }
    getOrders(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, limit = 0, skip = 0) {
            return yield this.orderDao.getOrders(userId, limit, skip);
        });
    }
    createOrder(userId, products) {
        return __awaiter(this, void 0, void 0, function* () {
            // return await this.orderDao.createOrder(userId, products);
            throw new Error("Method not implemented");
        });
    }
}
exports.OrderService = OrderService;

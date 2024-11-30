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
exports.OrderDao = void 0;
const order_1 = require("../models/order");
class OrderDao {
    getOrders(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, limit = 0, skip = 0) {
            const query = order_1.OrderModel.find({
                userId,
            });
            if (limit)
                query.limit(limit);
            if (skip)
                query.skip(skip);
            const orders = yield query.exec();
            return {
                data: orders,
                limit,
                skip,
                total: orders.length,
            };
        });
    }
    createOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const newOrder = new order_1.OrderModel(order);
            return yield newOrder.save();
        });
    }
}
exports.OrderDao = OrderDao;

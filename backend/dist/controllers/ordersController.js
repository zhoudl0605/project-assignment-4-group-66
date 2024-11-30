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
exports.OrdersController = void 0;
const user_1 = require("../models/user");
const orderService_1 = require("../services/orderService");
class OrdersController {
    static getOrdersController(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if the role is admin print all orders
            const body = ctx.request.body;
            const user = ctx.state.user;
            const limit = body.limit;
            const skip = body.skip;
            let userId = body.userId;
            if (user.role != user_1.UserRole.ADMIN) {
                userId = user._id;
            }
            const orderService = new orderService_1.OrderService();
            try {
                let orders = yield orderService.getOrders(userId, limit, skip);
                return (ctx.body = Object.assign({ status: "success" }, orders));
            }
            catch (error) {
                console.error("Error while getting orders", error.toString());
                ctx.status = 500;
                ctx.body = {
                    status: "error",
                    message: "Internal server error",
                };
                return;
            }
        });
    }
}
exports.OrdersController = OrdersController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const ordersController_1 = require("../controllers/ordersController");
const exceptionsController_1 = require("../controllers/exceptionsController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const ordersRouter = new koa_router_1.default({
    prefix: "/orders",
}).use(authMiddleware_1.authMiddleware);
// get all orders belonging to the user
ordersRouter.get("/", ordersController_1.OrdersController.getOrdersController);
ordersRouter.post("/", exceptionsController_1.ExceptionController.unimplemented);
ordersRouter.get("/:id", exceptionsController_1.ExceptionController.unimplemented);
exports.default = ordersRouter;

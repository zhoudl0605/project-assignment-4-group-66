import Router from "koa-router";
import { OrdersController } from "../controllers/orders";

const ordersRouter = new Router({
    prefix: "/orders",
});

// get all orders belonging to the user
ordersRouter.get("/", OrdersController.getOrdersController);

export default ordersRouter;

import Router from "koa-router";
import { OrdersController } from "../controllers/ordersController";
import { ExceptionController } from "../controllers/exceptionsController";
import { authMiddleware } from "../middlewares/authMiddleware";

const ordersRouter = new Router({
    prefix: "/orders",
}).use(authMiddleware);

// get all orders belonging to the user
ordersRouter.get("/", OrdersController.getOrdersController);
ordersRouter.post("/", ExceptionController.unimplemented);
ordersRouter.get("/:id", ExceptionController.unimplemented);

export default ordersRouter;

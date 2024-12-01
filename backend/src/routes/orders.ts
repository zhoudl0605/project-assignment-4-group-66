import { OrdersController } from "../controllers/ordersController";
import express from "express";

const ordersRouter = express.Router();

// get all orders belonging to the user
ordersRouter.get("/", async (req, res, next) => {
    OrdersController.getOrdersController(req, res, next);
});
ordersRouter.post("/", (req, res, next) => {
    OrdersController.postOrderController(req, res, next);
});
ordersRouter.get("/:id", (req, res, next) => {
    OrdersController.getOrderByIdController(req, res, next);
});
ordersRouter.put("/:id", (req, res, next) => {
    OrdersController.updateOrderController(req, res, next);
});
ordersRouter.delete("/:id", (req, res, next) => {
    OrdersController.deleteOrderController(req, res, next);
});

export default ordersRouter;

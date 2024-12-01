import Router from "koa-router";
import { OrdersController } from "../controllers/ordersController";
import { ExceptionController } from "../controllers/exceptionsController";
import { authMiddleware } from "../middlewares/authMiddleware";
import express from "express";

const ordersRouter = express.Router();

// get all orders belonging to the user
ordersRouter.get("/", async (req, res, next) => {
    OrdersController.getOrdersController(req, res, next);
});
ordersRouter.post("/", (req, res, next) => {
    ExceptionController.unimplemented(req, res, next);
});
ordersRouter.get("/:id", (req, res, next) => {
    ExceptionController.unimplemented(req, res, next);
});

export default ordersRouter;

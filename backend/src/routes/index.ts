import App from "koa";
import express from "express";
import authRouter from "./auth";
import usersRouter from "./users";
import shoppingCartRouter from "./shoppingCarts";
import ordersRouter from "./orders";
import productsRouter from "./products";
import cateRouter from "./categories";
import { Express } from "express-serve-static-core";

export function registerRoutes(app: Express) {
    app.use("/auth", authRouter);
    app.use("/users", usersRouter);
    app.use("/shopping-carts", shoppingCartRouter);
    app.use("/orders", ordersRouter);
    app.use("/products", productsRouter);
    app.use("/categories", cateRouter);
}

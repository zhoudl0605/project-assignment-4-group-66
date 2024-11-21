import App from "koa";
import Router from "koa-router";
import authRouter from "./auth";
import usersRouter from "./users";
import shoppingCartRouter from "./shoppingCarts";
import ordersRouter from "./orders";
import productsRouter from "./products";
import cateRouter from "./categories";

const indexRouter = new Router({});
indexRouter.all("/ping", async (ctx) => {
    ctx.body = "pong";
});

export const registerRoutes = (app: App): void => {
    app.use(indexRouter.routes());
    app.use(authRouter.routes());
    app.use(usersRouter.routes());
    app.use(shoppingCartRouter.routes());
    app.use(ordersRouter.routes());
    app.use(productsRouter.routes());
    app.use(cateRouter.routes());
};

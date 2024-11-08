import App from "koa";
import Router from "koa-router";

const indexRouter = new Router({});
indexRouter.all("/ping", async (ctx) => {
    ctx.body = "pong";
});

export const registerRoutes = (app: App): void => {
    app.use(indexRouter.routes());
};

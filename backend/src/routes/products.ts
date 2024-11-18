import Router from "koa-router";
import { ExceptionController } from "../controllers/exceptionsController";

const productsRouter = new Router({
    prefix: "/products",
});

productsRouter.post("", ExceptionController.unimplemented);
productsRouter.get("", ExceptionController.unimplemented);
productsRouter.get("/:id", ExceptionController.unimplemented);

export default productsRouter;

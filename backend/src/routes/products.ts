import Router from "koa-router";
import { ExceptionController } from "../controllers/exceptionsController";
import { ProductsController } from "../controllers/productsController";

const productsRouter = new Router({
    prefix: "/products",
});

productsRouter.post("/", ProductsController.postProductsController);
productsRouter.get("/", ProductsController.getProductsController);
productsRouter.get("/:id", ExceptionController.unimplemented);

export default productsRouter;

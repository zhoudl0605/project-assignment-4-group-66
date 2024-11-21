import Router from "koa-router";
import { ExceptionController } from "../controllers/exceptionsController";

const cateRouter = new Router({
    prefix: "/categories",
});

cateRouter.post("/", ExceptionController.unimplemented);
cateRouter.get("/", ExceptionController.unimplemented);
cateRouter.get("/:id", ExceptionController.unimplemented);

export default cateRouter;

import Router from "koa-router";
import { UsersController } from "../controllers/usersController";

const usersRouter = new Router({
    prefix: "/users",
});

// GET /users - List of users
usersRouter.get("/", UsersController.getUsersController);
usersRouter.get("/:id", UsersController.getUserController);
usersRouter.put("/:id", UsersController.updateUserController);

export default usersRouter;

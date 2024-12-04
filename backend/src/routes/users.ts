import express from "express";
import { UsersController } from "../controllers/usersController";

const usersRouter = express.Router();

// GET /users - List of users
usersRouter.get("/", async (req, res, next) => {
    UsersController.getUsersController(req, res, next);
});
usersRouter.get("/:id", async (req, res, next) => {
    UsersController.getUserController(req, res, next);
});
usersRouter.put("/:id", async (req, res, next) => {
    UsersController.updateUserController(req, res, next);
});
usersRouter.delete("/:id", async (req, res, next) => {
    UsersController.deleteUserController(req, res, next);
});
usersRouter.post("/", async (req, res, next) => {
    UsersController.postUsersController(req, res, next);
});

export default usersRouter;

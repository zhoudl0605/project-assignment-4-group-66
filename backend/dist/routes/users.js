"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const usersController_1 = require("../controllers/usersController");
const usersRouter = new koa_router_1.default({
    prefix: "/users",
});
// GET /users - List of users
usersRouter.get("/", usersController_1.UsersController.getUsersController);
usersRouter.get("/:id", usersController_1.UsersController.getUserController);
usersRouter.put("/:id", usersController_1.UsersController.updateUserController);
exports.default = usersRouter;

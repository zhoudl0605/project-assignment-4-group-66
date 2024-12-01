import express from "express";
import { ShoppingCartController } from "../controllers/shoppingCartController";
import { authMiddleware } from "../middlewares/authMiddleware";

const usersRouter = express.Router();
// set current route level middleware
// shoppingCartRouter.use(authMiddleware);

usersRouter.get("/", authMiddleware, async (req, res, next) => {
    ShoppingCartController.getShoppingCartController(req, res, next);
});

usersRouter.post("/:id", authMiddleware, async (req, res, next) => {
    ShoppingCartController.postShoppingCartController(req, res, next);
});

usersRouter.put("/:id", authMiddleware, async (req, res, next) => {
    ShoppingCartController.putShoppingCartController(req, res, next);
});

usersRouter.delete("/:id", authMiddleware, async (req, res, next) => {
    ShoppingCartController.clearShoppingCartController(req, res, next);
});

usersRouter.delete(
    "/:id/:productId",
    authMiddleware,
    async (req, res, next) => {
        ShoppingCartController.deleteShoppingCartItemController(req, res, next);
    }
);

export default usersRouter;

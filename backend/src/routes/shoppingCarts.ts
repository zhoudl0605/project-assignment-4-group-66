import express from "express";
import { ShoppingCartController } from "../controllers/shoppingCartController";
import { authMiddleware } from "../middlewares/authMiddleware";

const shoppingCartRouter = express.Router();
// set current route level middleware
// shoppingCartRouter.use(authMiddleware);

shoppingCartRouter.get("/", authMiddleware, async (req, res, next) => {
    ShoppingCartController.getShoppingCartController(req, res, next);
});

shoppingCartRouter.post("/:id", authMiddleware, async (req, res, next) => {
    ShoppingCartController.postShoppingCartController(req, res, next);
});

shoppingCartRouter.put("/:id", authMiddleware, async (req, res, next) => {
    ShoppingCartController.putShoppingCartController(req, res, next);
});

shoppingCartRouter.delete("/:id", authMiddleware, async (req, res, next) => {
    ShoppingCartController.clearShoppingCartController(req, res, next);
});

shoppingCartRouter.delete(
    "/:id/:productId",
    authMiddleware,
    async (req, res, next) => {
        ShoppingCartController.deleteShoppingCartItemController(req, res, next);
    }
);

export default shoppingCartRouter;

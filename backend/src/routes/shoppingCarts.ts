import Router from "koa-router";
import { ShoppingCartController } from "../controllers/shoppingCart";
import { authMiddleware } from "../middlewares/authMiddleware";

const shoppingCartRouter = new Router({
    prefix: "/shopping-cart",
});

// set current route level middleware
shoppingCartRouter.use(authMiddleware);

// get shopping cart
shoppingCartRouter.get(
    "/:id",
    ShoppingCartController.getShoppingCartController
);

// set shopping cart items
shoppingCartRouter.post(
    "/:id",
    ShoppingCartController.postShoppingCartController
);

// clear shopping cart
shoppingCartRouter.delete(
    "/:id",
    ShoppingCartController.clearShoppingCartController
);

// add products to shopping cart
shoppingCartRouter.put(
    "/:id",
    ShoppingCartController.putShoppingCartController
);

// delete product from shopping cart
shoppingCartRouter.delete(
    "/:id/:productId",
    ShoppingCartController.deleteShoppingCartItemController
);

export default shoppingCartRouter;

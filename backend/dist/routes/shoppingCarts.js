"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const shoppingCartController_1 = require("../controllers/shoppingCartController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const shoppingCartRouter = new koa_router_1.default({
    prefix: "/shopping-cart",
});
// set current route level middleware
shoppingCartRouter.use(authMiddleware_1.authMiddleware);
// get shopping cart
shoppingCartRouter.get("/:id", shoppingCartController_1.ShoppingCartController.getShoppingCartController);
// set shopping cart items
shoppingCartRouter.post("/:id", shoppingCartController_1.ShoppingCartController.postShoppingCartController);
// clear shopping cart
shoppingCartRouter.delete("/:id", shoppingCartController_1.ShoppingCartController.clearShoppingCartController);
// add products to shopping cart
shoppingCartRouter.put("/:id", shoppingCartController_1.ShoppingCartController.putShoppingCartController);
// delete product from shopping cart
shoppingCartRouter.delete("/:id/:productId", shoppingCartController_1.ShoppingCartController.deleteShoppingCartItemController);
exports.default = shoppingCartRouter;

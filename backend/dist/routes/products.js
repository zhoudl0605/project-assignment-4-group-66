"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const exceptionsController_1 = require("../controllers/exceptionsController");
const productsController_1 = require("../controllers/productsController");
const productsRouter = new koa_router_1.default({
    prefix: "/products",
});
productsRouter.post("/", productsController_1.ProductsController.postProductsController);
productsRouter.get("/", productsController_1.ProductsController.getProductsController);
productsRouter.get("/:id", exceptionsController_1.ExceptionController.unimplemented);
exports.default = productsRouter;

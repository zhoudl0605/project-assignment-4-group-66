import Router from "koa-router";
import { ExceptionController } from "../controllers/exceptionsController";
import { ProductsController } from "../controllers/productsController";
import express from "express";

const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
    ProductsController.postProductsController(req, res, next);
});
productsRouter.get("/", async (req, res, next) => {
    ProductsController.getProductsController(req, res, next);
});
productsRouter.get("/:id", async (req, res, next) => {
    ProductsController.getProductByIdController(req, res, next);
});
productsRouter.put("/:id", async (req, res, next) => {
    ProductsController.updateProductController(req, res, next);
});
productsRouter.delete("/:id", async (req, res, next) => {
    ProductsController.deleteProductByIdController(req, res, next);
});

export default productsRouter;


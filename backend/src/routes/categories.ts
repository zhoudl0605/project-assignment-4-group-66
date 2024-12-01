import express from "express";
import { ExceptionController } from "../controllers/exceptionsController";
import { CategoryController } from "../controllers/categoryController";

const cateRouter = express.Router();
cateRouter.post("/", (req, res, next) => {
    CategoryController.postCategoryController(req, res, next);
});
cateRouter.get("/", (req, res, next) => {
    CategoryController.getCategoriesController(req, res, next);
});
cateRouter.get("/:id", (req, res, next) => {
    CategoryController.getCategoryController(req, res, next);
});
cateRouter.put("/:id", (req, res, next) => {
    CategoryController.putCategoryController(req, res, next);
});

export default cateRouter;

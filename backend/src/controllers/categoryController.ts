import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/categoryService";
import { RequestErrorResponse, RequestSuccessResponse } from "../types";

export class CategoryController {
    // 创建分类
    public static async postCategoryController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const body = req.body;
        const categoryService = new CategoryService();

        try {
            const category = await categoryService.createCategory(body);
            // 验证分类数据
            const errors = category.validateSync();
            if (errors) {
                console.error(
                    "Error while validating category:",
                    errors.message
                );
                return res.status(400).json({
                    status: "error",
                    message: errors.message,
                } as RequestErrorResponse);
            }

            // 保存分类
            await category.save();

            return res.status(201).json({
                status: "success",
                data: category,
            } as RequestSuccessResponse);
        } catch (error: any) {
            // handle mongoServerError
            if (error.code === 11000) {
                return res.status(400).json({
                    status: "error",
                    message: "Category already exists",
                } as RequestErrorResponse);
            }

            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse);
        }
    }

    // 获取分类列表
    public static async getCategoriesController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const categoryService = new CategoryService();
        const query = req.query;

        try {
            const categories = await categoryService.getCategories(query);

            return res.status(200).json({
                status: "success",
                data: categories,
            } as RequestSuccessResponse);
        } catch (error: any) {
            console.error("Error while fetching categories:", error.toString());
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse);
        }
    }

    // 获取分类
    public static async getCategoryController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const categoryService = new CategoryService();
        const id = req.params.id;

        try {
            const category = await categoryService.getCategoryById(id);

            if (!category) {
                return res.status(404).json({
                    status: "error",
                    message: "Category not found",
                } as RequestErrorResponse);
            }

            return res.status(200).json({
                status: "success",
                data: category,
            } as RequestSuccessResponse);
        } catch (error: any) {
            console.error("Error while fetching category:", error.toString());
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse);
        }
    }

    public static async putCategoryController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const categoryService = new CategoryService();
        const id = req.params.id;
        const body = req.body;

        try {
            const updatedCategory = await categoryService.updateCategory(
                id,
                body
            );

            if (!updatedCategory) {
                return res.status(404).json({
                    status: "error",
                    message: "Category not found",
                } as RequestErrorResponse);
            }

            return res.status(200).json({
                status: "success",
                data: updatedCategory,
            } as RequestSuccessResponse);
        } catch (error: any) {
            console.error("Error while updating category:", error.toString());
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse);
        }
    }
}

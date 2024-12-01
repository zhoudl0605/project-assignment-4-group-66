import { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/productService";
import { RequestErrorResponse, RequestSuccessResponse } from "../types";

export class ProductsController {
    // 创建产品
    public static async postProductsController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const body = req.body;
        const productService = new ProductService();
        console.log("body", body);

        try {
            const product = await productService.createProduct(body);

            // 运行验证
            const errors = product.validateSync();
            if (errors) {
                console.error(
                    "Error while validating product:",
                    errors.message
                );

                return res.status(400).json({
                    status: "error",
                    message: errors.message,
                } as RequestErrorResponse);
            }

            // 保存产品
            await product.save();

            return res.status(201).json({
                status: "success",
                data: product,
            } as RequestSuccessResponse);
        } catch (error: any) {
            console.error("Error while creating product:", error.toString());
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse);
        }
    }

    // 获取产品列表
    public static async getProductsController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const productService = new ProductService();
        const query = req.query;

        try {
            const products = await productService.getProducts(query);
            return res.status(200).json({
                status: "success",
                data: products,
            } as RequestSuccessResponse);
        } catch (error: any) {
            console.error("Error while fetching products:", error.toString());
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse);
        }
    }

    public static async getProductByIdController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const productService = new ProductService();
        const id = req.params.id;

        try {
            const product = await productService.getProductById(id);
            if (!product) {
                return res.status(404).json({
                    status: "error",
                    message: "Product not found",
                } as RequestErrorResponse);
            }

            return res.status(200).json({
                status: "success",
                data: product,
            } as RequestSuccessResponse);
        } catch (error: any) {
            console.error(
                "Error while fetching product by ID:",
                error.toString()
            );
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse);
        }
    }

    public static async deleteProductByIdController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const productService = new ProductService();
        const id = req.params.id;

        try {
            const product = await productService.deleteProduct(id);
            if (!product) {
                return res.status(404).json({
                    status: "error",
                    message: "Product not found",
                } as RequestErrorResponse);
            }

            return res.status(200).json({
                status: "success",
                data: product,
            } as RequestSuccessResponse);
        } catch (error: any) {
            console.error("Error while deleting product:", error.toString());
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse);
        }
    }

    public static async updateProductController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const productService = new ProductService();
        const id = req.params.id;
        const body = req.body;

        try {
            const product = await productService.updateProduct(id, body);
            if (!product) {
                return res.status(404).json({
                    status: "error",
                    message: "Product not found",
                } as RequestErrorResponse);
            }

            return res.status(200).json({
                status: "success",
                data: product,
            } as RequestSuccessResponse);
        } catch (error: any) {
            console.error("Error while updating product:", error.toString());
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse);
        }
    }
}

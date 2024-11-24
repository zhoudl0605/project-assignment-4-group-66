import { ProductService } from "../services/productService";
import { RequestErrorResponse, RequestSuccessResponse } from "../types";

export class ProductsController {
    public static async postProductsController(ctx: any) {
        const body = ctx.request.body;
        const productService = new ProductService();

        try {
            const product = await productService.createProduct(body);
            // run validation
            let errors = product.validateSync();
            if (errors) {
                ctx.status = 400;
                return (ctx.body = {
                    status: "error",
                    message: errors.message,
                }) as RequestErrorResponse;
            }

            // save the product
            await product.save();

            return (ctx.body = {
                status: "success",
                data: product,
            }) as RequestSuccessResponse;
        } catch (error: any) {
            console.error("Error while creating product", error.toString());
            ctx.status = 500;
            ctx.body = {
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse;
            return;
        }
    }

    public static async getProductsController(ctx: any) {
        const productService = new ProductService();
        const query = ctx.query;

        try {
            const products = await productService.getProducts(query);
            return (ctx.body = {
                status: "success",
                data: products,
            }) as RequestSuccessResponse;
        } catch (error: any) {
            console.error("Error while fetching products", error.toString());
            ctx.status = 500;
            ctx.body = {
                status: "error",
                message: "Internal server error",
            } as RequestErrorResponse;
            return;
        }
    }
}

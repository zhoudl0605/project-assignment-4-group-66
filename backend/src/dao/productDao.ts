import { IProduct, ProductModel } from "../models/product";
import mongoose from "mongoose";

export class ProductDao {
    public async getProducts(query: {
        limit?: number;
        skip?: number;
        category?: string;
    }): Promise<IProduct[]> {
        const { limit = null, skip = 0, category } = query;
        const filter: any = {};

        if (category) {
            filter.category = category;
        }

        try {
            return await ProductModel.find(filter)
                .limit(Number(limit))
                .skip(Number(skip))
                .exec();
        } catch (error: any) {
            console.error("Error fetching products:", error.message);
            throw new Error("Failed to fetch products");
        }
    }

    public async getProductById(id: string): Promise<IProduct | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error("Invalid product ID:", id);
            throw new Error("Invalid product ID");
        }

        try {
            return await ProductModel.findById(id).exec();
        } catch (error: any) {
            console.error("Error fetching product by ID:", error.message);
            throw new Error("Failed to fetch product by ID");
        }
    }

    public async createProduct(data: Partial<IProduct>): Promise<IProduct> {
        try {
            const product = new ProductModel(data);

            const errors = product.validateSync();
            if (errors) {
                console.error("Validation error:", errors.message);
                throw new Error(`Invalid data: ${errors.message}`);
            }

            return await product.save();
        } catch (error: any) {
            console.error("Error creating product:", error.message);
            throw new Error(
                error.name === "ValidationError"
                    ? `Validation error: ${error.message}`
                    : "Failed to create product"
            );
        }
    }

    public async updateProduct(
        id: string,
        data: Partial<IProduct>
    ): Promise<IProduct | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error("Invalid product ID:", id);
            throw new Error("Invalid product ID");
        }

        try {
            return await ProductModel.findByIdAndUpdate(id, data, {
                new: true,
            }).exec();
        } catch (error: any) {
            console.error("Error updating product:", error.message);
            throw new Error(
                error.name === "ValidationError"
                    ? `Validation error: ${error.message}`
                    : "Failed to update product"
            );
        }
    }

    public async deleteProduct(id: string): Promise<IProduct | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error("Invalid product ID:", id);
            throw new Error("Invalid product ID");
        }

        try {
            return await ProductModel.findByIdAndDelete(id).exec();
        } catch (error: any) {
            console.error("Error deleting product:", error.message);
            throw new Error("Failed to delete product");
        }
    }
}

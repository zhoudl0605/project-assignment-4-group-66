import { ProductDao } from "../dao/productDao";
import { IProduct, ProductModel } from "../models/product";

export class ProductService {
    public async createProduct(params: {}): Promise<IProduct> {
        try {
            return new ProductModel(params);
        } catch (error: any) {
            // 捕获错误并抛出
            console.error("Error creating product:", error.message);
            throw new Error(`Failed to create product: ${error.message}`);
        }
    }

    public async getProducts(query: {}): Promise<IProduct[]> {
        try {
            const productDao = new ProductDao();
            return await productDao.getProducts(query);
        } catch (error: any) {
            console.error("Error creating productDao:", error.message);
        }
        throw new Error("Method not implemented");
    }

    public async getProductById(id: string): Promise<IProduct | null> {
        try {
            const productDao = new ProductDao();
            return await productDao.getProductById(id);
        } catch (error: any) {
            console.error("Error fetching product by ID:", error.message);
            throw new Error(`Failed to fetch product by ID: ${error.message}`);
        }
    }

    public async deleteProduct(id: string): Promise<IProduct | null> {
        try {
            const productDao = new ProductDao();
            return await productDao.deleteProduct(id);
        } catch (error: any) {
            console.error("Error deleting product:", error.message);
            throw new Error(`Failed to delete product: ${error.message}`);
        }
    }

    public async updateProduct(
        id: string,
        data: Partial<IProduct>
    ): Promise<IProduct | null> {
        try {
            console.log("id", id);
            console.log("data", data);

            const productDao = new ProductDao();
            return await productDao.updateProduct(id, data);
        } catch (error: any) {
            console.error("Error updating product:", error.message);
            throw new Error(`Failed to update product: ${error.message}`);
        }
    }
}

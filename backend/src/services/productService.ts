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
}

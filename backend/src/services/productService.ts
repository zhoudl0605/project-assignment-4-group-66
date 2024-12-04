import { ProductDao } from "../dao/productDao";
import { IProduct, ProductModel } from "../models/product";

export class ProductService {
    private productDao: ProductDao;

    constructor(productDao: ProductDao = new ProductDao()) {
        this.productDao = productDao;
    }

    public async createProduct(params: IProduct): Promise<IProduct> {
        try {
            return await this.productDao.createProduct(params);
        } catch (error: any) {
            throw new Error(`Failed to create product: ${error.message}`);
        }
    }

    public async getProducts(query: {}): Promise<IProduct[]> {
        try {
            return await this.productDao.getProducts(query);
        } catch (error: any) {
            throw new Error(`Failed to fetch products: ${error.message}`);
        }
    }

    public async getProductById(id: string): Promise<IProduct | null> {
        try {
            return await this.productDao.getProductById(id);
        } catch (error: any) {
            throw new Error(`Failed to fetch product by ID: ${error.message}`);
        }
    }

    public async deleteProduct(id: string): Promise<IProduct | null> {
        try {
            return await this.productDao.deleteProduct(id);
        } catch (error: any) {
            throw new Error(`Failed to delete product: ${error.message}`);
        }
    }

    public async updateProduct(
        id: string,
        data: Partial<IProduct>
    ): Promise<IProduct | null> {
        try {
            return await this.productDao.updateProduct(id, data);
        } catch (error: any) {
            throw new Error(`Failed to update product: ${error.message}`);
        }
    }
}

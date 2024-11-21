import { IProduct, ProductModel } from "../models/product";

export class ProductDao {
    public async getProducts(query: {}): Promise<IProduct[]> {
        // get products from database
        let products = await ProductModel.find(query)
            .populate("category")
            .exec();

        return products;
    }
}

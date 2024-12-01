import { IProduct, ProductModel } from "../models/product";

export class ProductDao {
    // 获取产品列表
    public async getProducts(query: any): Promise<IProduct[]> {
        const { limit = 10, skip = 0, category } = query;
        const filter: any = {};

        if (category) {
            filter.category = category;
        }

        // 从数据库获取产品
        return await ProductModel.find(filter)
            .populate("category")
            .limit(Number(limit))
            .skip(Number(skip))
            .exec();
    }

    // 根据 ID 获取产品
    public async getProductById(id: string): Promise<IProduct | null> {
        return await ProductModel.findById(id).populate("category").exec();
    }

    // 创建产品
    public async createProduct(data: Partial<IProduct>): Promise<IProduct> {
        const product = new ProductModel(data);
        return await product.save();
    }

    // 更新产品
    public async updateProduct(
        id: string,
        data: Partial<IProduct>
    ): Promise<IProduct | null> {
        return await ProductModel.findByIdAndUpdate(id, data, { new: true })
            .populate("category")
            .exec();
    }

    // 删除产品
    public async deleteProduct(id: string): Promise<IProduct | null> {
        return await ProductModel.findByIdAndDelete(id).exec();
    }
}

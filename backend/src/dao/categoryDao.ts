import { ICategory, CategoryModel } from "../models/category";

export class CategoryDao {
    // 获取分类列表
    public async getCategories(query: any): Promise<ICategory[]> {
        const { limit = 10, skip = 0 } = query;

        return await CategoryModel.find({})
            .limit(Number(limit))
            .skip(Number(skip))
            .exec();
    }

    // 根据条件查询分类
    public async getCategoryById(id: string): Promise<ICategory | null> {
        return await CategoryModel.findById(id).exec();
    }

    // 根据名称查询分类
    public async getCategoryByName(name: string): Promise<ICategory | null> {
        return await CategoryModel.findOne({ name }).exec();
    }

    // 创建分类
    public async createCategory(data: Partial<ICategory>): Promise<ICategory> {
        const category = new CategoryModel(data);
        return await category.save();
    }

    public async updateCategory(
        id: string,
        data: Partial<ICategory>
    ): Promise<ICategory | null> {
        return await CategoryModel.findByIdAndUpdate(id, data, {
            new: true,
        }).exec();
    }
}

import { ICategory, CategoryModel } from "../models/category";

export class CategoryDao {
    public async getCategories(query: any): Promise<ICategory[]> {
        const { limit = null, skip = 0 } = query;

        return await CategoryModel.find({})
            .limit(Number(limit))
            .skip(Number(skip))
            .exec();
    }

    public async getCategoryById(id: string): Promise<ICategory | null> {
        return await CategoryModel.findById(id).exec();
    }

    public async getCategoryByName(name: string): Promise<ICategory | null> {
        return await CategoryModel.findOne({ name }).exec();
    }

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

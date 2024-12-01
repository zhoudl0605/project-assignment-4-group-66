import { CategoryDao } from "../dao/categoryDao";
import { ICategory, CategoryModel } from "../models/category";

export class CategoryService {
    // 创建分类
    public async createCategory(params: {}): Promise<ICategory> {
        try {
            return new CategoryModel(params);
        } catch (error: any) {
            console.error("Error creating category:", error.message);
            throw new Error(`Failed to create category: ${error.message}`);
        }
    }

    // 获取分类列表
    public async getCategories(query: {}): Promise<ICategory[]> {
        try {
            const categoryDao = new CategoryDao();
            return await categoryDao.getCategories(query);
        } catch (error: any) {
            console.error("Error fetching categories:", error.message);
            throw new Error(`Failed to fetch categories: ${error.message}`);
        }
    }

    // 根据 ID 获取分类
    public async getCategoryById(id: string): Promise<ICategory | null> {
        try {
            const categoryDao = new CategoryDao();
            return await categoryDao.getCategoryById(id);
        } catch (error: any) {
            console.error("Error fetching category by ID:", error.message);
            throw new Error(`Failed to fetch category by ID: ${error.message}`);
        }
    }

    public async updateCategory(
        id: string,
        data: Partial<ICategory>
    ): Promise<ICategory | null> {
        try {
            const categoryDao = new CategoryDao();
            return await categoryDao.updateCategory(id, data);
        } catch (error: any) {
            console.error("Error updating category:", error.message);
            throw new Error(`Failed to update category: ${error.message}`);
        }
    }
}

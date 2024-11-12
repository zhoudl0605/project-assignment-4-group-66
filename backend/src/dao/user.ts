// src/dao/userDao.ts

import { UserModel } from "../models/user";
import { IUser } from "../models/user";

export class UserDao {
    /**
     * 创建用户
     * @param userData 用户数据
     */
    async createUser(userData: IUser): Promise<IUser> {
        const newUser = new UserModel(userData);
        return await newUser.save();
    }

    /**
     * 根据ID查找用户
     * @param id 用户ID
     */
    async findUserById(id: string): Promise<IUser | null> {
        return await UserModel.findById(id);
    }

    /**
     * 根据Email查找用户
     * @param email 用户Email
     */
    async findUserByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email });
    }

    /**
     * 更新用户信息
     * @param id 用户ID
     * @param updateData 更新数据
     */
    async updateUser(
        id: string,
        updateData: Partial<IUser>
    ): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    /**
     * 删除用户
     * @param id 用户ID
     */
    async deleteUser(id: string): Promise<void> {
        await UserModel.findByIdAndDelete(id);
    }
}

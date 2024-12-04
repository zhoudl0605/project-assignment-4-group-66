// src/dao/userDao.ts

import { UserModel } from "../models/user";
import { IUser } from "../models/user";
import { DbQueryResult } from "../types";

export class UserDao {
    /**
     * create a new user
     * @param userData
     */
    async createUser(userData: IUser): Promise<IUser> {
        const newUser = new UserModel(userData);
        return await newUser.save();
    }

    /**
     * find user by id
     * @param id
     */
    async getUserById(id: string): Promise<IUser | null> {
        return await UserModel.findById(id);
    }

    /**
     * find user by email
     * @param email
     */
    async findUserByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email });
    }

    /**
     * update user
     * @param userId
     * @param updateData
     */
    async updateUser(
        userId: string,
        updateData: Partial<IUser>
    ): Promise<IUser | null> {
        try {
            // 如果 password 为空，则不更新 password
            if (!updateData.password) {
                delete updateData.password;
            }

            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                { $set: updateData }, // 使用 $set 只更新指定字段
                { new: true, runValidators: true } // 返回更新后的文档并验证
            );

            if (!updatedUser) {
                throw new Error("User not found");
            }

            return updatedUser;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }

    /**
     * delete user
     * @param id
     */
    async deleteUser(id: string): Promise<IUser> {
        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (!deletedUser) {
            throw new Error(`User with id ${id} not found`);
        }
        return deletedUser;
    }

    /**
     * get all users
     */
    async getUsers(
        limit: number = 0,
        skip: number = 0
    ): Promise<DbQueryResult<IUser[]>> {
        const query = UserModel.find({});
        if (limit) query.limit(limit);
        if (skip) query.skip(skip);

        const users = await query;
        const total = await UserModel.countDocuments();

        // remove password field from users
        users.forEach((user) => {
            user.password = "";
        });

        return {
            data: users,
            limit,
            skip,
            total,
        };
    }
}

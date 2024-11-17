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
    async findUserById(id: string): Promise<IUser | null> {
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
     * @param id
     * @param updateData
     */
    async updateUser(
        id: string,
        updateData: Partial<IUser>
    ): Promise<IUser | null> {
        const opts = { runValidators: true, new: true };
        return await UserModel.findByIdAndUpdate(id, updateData, opts);
    }

    /**
     * delete user
     * @param id
     */
    async deleteUser(id: string): Promise<void> {
        await UserModel.findByIdAndDelete(id);
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

        return {
            data: users,
            limit,
            skip,
            total,
        };
    }
}

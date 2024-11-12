// src/models/user.ts

import mongoose, { Schema, Document } from "mongoose";

export type UserAddress = {
    address1: string;
    address2?: string;
    city: string;
    province: string;
    postalCode: string;
};

// define User data type
export interface IUser extends Document {
    name: string;
    email: string;
    role?: string;
    password: string;
    salt: string;
    address?: UserAddress;
    createdAt?: Date;
}

// define User modle Schema
const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: "user",
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/, // 简单的邮箱验证
    },
    address: {
        address1: {
            type: String,
            required: true,
        },
        address2: {
            type: String,
        },
        city: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// 创建并导出 User 模型
export const UserModel = mongoose.model<IUser>("User", UserSchema);

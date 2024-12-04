import mongoose, { Schema, Document } from "mongoose";

export enum UserRole {
    USER = "user",
    ADMIN = "admin",
}

export type UserAddress = {
    address1: string;
    address2?: string;
    city: string;
    province: string;
    postalCode: string;
};

// 定义 User 数据类型
export interface IUser extends Document {
    name: string;
    email: string;
    role: UserRole;
    password: string;
    address?: UserAddress;
    createdAt?: Date;
    updatedAt?: Date;
}

// 定义 Address Schema
const AddressSchema: Schema = new Schema({
    address1: {
        type: String,
        required: true,
    },
    address2: {
        type: String,
        default: "",
    },
    city: {
        type: String,
        required: true,
        default: "",
    },
    province: {
        type: String,
        required: true,
        default: "",
    },
    postalCode: {
        type: String,
        required: true,
        default: "",
    },
});

// 定义 User Schema
const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        },
        role: {
            type: String,
            enum: Object.values(UserRole), // 使用 UserRole 枚举
            default: UserRole.USER,
        },
        address: {
            type: AddressSchema, // 嵌套 Address Schema
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // 自动生成 createdAt 和 updatedAt
    }
);

UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password; // 删除 password 字段
    return obj;
};

// 创建并导出 User 模型
export const UserModel = mongoose.model<IUser>("User", UserSchema);

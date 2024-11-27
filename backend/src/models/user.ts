import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

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
    comparePassword(candidatePassword: string): Promise<boolean>;
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

// 在保存用户之前加密密码
UserSchema.pre("save", async function (next) {
    const user = this as any as IUser;
    if (!user.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
});

// 添加比较密码的方法
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// 创建并导出 User 模型
export const UserModel = mongoose.model<IUser>("User", UserSchema);

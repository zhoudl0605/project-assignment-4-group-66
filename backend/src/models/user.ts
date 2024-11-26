import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcrypt';

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

// define User data type
export interface IUser extends Document {
    name: string;
    email: string;
    role?: string;
    password: string;
    address?: UserAddress;
    createdAt?: Date;
    updatedAt?: Date;
}

// define User model Schema
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
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving user
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// 创建并导出 User 模型
export const UserModel = mongoose.model<IUser>("User", UserSchema);

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

export interface IUser extends Document {
    name: string;
    email: string;
    role: UserRole;
    password: string;
    address?: UserAddress;
    createdAt?: Date;
    updatedAt?: Date;
}

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
            enum: Object.values(UserRole), 
            default: UserRole.USER,
        },
        address: {
            type: AddressSchema, 
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, 
    }
);

UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password; 
    return obj;
};

export const UserModel = mongoose.model<IUser>("User", UserSchema);

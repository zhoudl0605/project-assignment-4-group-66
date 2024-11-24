import mongoose, { Schema, Document } from "mongoose";

// define Product data type
export interface IProduct extends Document {
    name: string;
    price: number;
    categoryId: string;
    brand: string;
    sku: string;
    stock: number;
    createdAt: Date;
    medias: string[];
    specs: string[];
    description: string;
}

// define Product modole Schema
const ProductSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        price: { type: Number, required: true, min: 0 },
        categoryId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Category",
        },
        brand: {
            type: String,
            required: true,
        },
        sku: { type: String, required: true, unique: true, index: true },
        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        medias: {
            type: [String],
            default: [],
        },
        specs: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

export const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);

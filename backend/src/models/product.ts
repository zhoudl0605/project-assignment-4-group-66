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
}

// define Product modole Schema
const ProductSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    categoryId: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    medias: {
        type: [String],
        required: true,
    },
    specs: {
        type: [String],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);

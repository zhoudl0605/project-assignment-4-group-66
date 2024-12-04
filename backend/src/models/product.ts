import mongoose, { Schema, Document } from "mongoose";

// define Product data type
export interface IProduct extends Document {
    name: string;
    price: number;
    category: "laptop" | "desktop" | "accessories";
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
        category: {
            type: String,
            required: true,
            enum: ["laptop", "desktop", "accessories"], // Allowed values
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

ProductSchema.pre("save", async function (next) {
    const existingProduct = await ProductModel.findOne({ sku: this.sku });
    if (
        existingProduct &&
        existingProduct._id?.toString() !== this._id?.toString()
    ) {
        throw new Error("SKU must be unique.");
    }
    next();
});

export const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);

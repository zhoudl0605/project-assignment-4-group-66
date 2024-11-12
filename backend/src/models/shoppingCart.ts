import mongoose, { Schema, Document } from "mongoose";

export interface IShoppingCart extends Document {
    userId: string;
    products: {
        productId: string;
        quantity: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const ShoppingCartSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    products: [
        {
            productId: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export const ShoppingCartModel = mongoose.model<IShoppingCart>(
    "ShoppingCart",
    ShoppingCartSchema
);

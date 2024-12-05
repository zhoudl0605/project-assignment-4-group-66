import mongoose, { Schema, Document, Types } from "mongoose";

export interface IShoppingCart extends Document {
    userId: Types.ObjectId;
    products: {
        productId: Types.ObjectId;
        quantity: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const ShoppingCartSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1, 
                },
            },
        ],
    },
    {
        timestamps: true, 
    }
);

export const ShoppingCartModel = mongoose.model<IShoppingCart>(
    "ShoppingCart",
    ShoppingCartSchema
);

import mongoose, { Schema, Document } from "mongoose";

export type OrderStatus = "pending" | "completed" | "cancelled";

export interface IOrder extends Document {
    userId: string;
    products: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
    subTotal?: number;
    tax?: number;
}

const OrderSchema: Schema = new Schema({
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
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        required: true,
        default: "pending",
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

export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);

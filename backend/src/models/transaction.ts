import mongoose, { Schema, Document, Types } from "mongoose";

export type TransactionStatus = "pending" | "completed" | "cancelled";

export interface ITransaction extends Document {
    userId: Types.ObjectId;
    orderId: Types.ObjectId;
    amount: number;
    status: TransactionStatus;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order", 
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0, 
        },
        status: {
            type: String,
            enum: ["pending", "completed", "cancelled"], 
            required: true,
        },
        metadata: {
            type: Schema.Types.Mixed, 
            default: {}, 
        },
    },
    {
        timestamps: true, 
    }
);

export const TransactionModel = mongoose.model<ITransaction>(
    "Transaction",
    TransactionSchema
);

import mongoose, { Schema, Document } from "mongoose";

export type TransactionStatus = "pending" | "completed" | "cancelled";

export interface ITransaction extends Document {
    userId: string;
    orderId: string;
    amount: number;
    status: TransactionStatus;
    createdAt: Date;
    updatedAt: Date;
    metadata?: {
        [key: string]: any;
    };
}

const TransactionSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        required: true,
        // for current implementation, we only have "completed" status
        default: "completed",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    metadata: {
        type: Schema.Types.Mixed,
    },
});

export const TransactionModel = mongoose.model<ITransaction>(
    "Transaction",
    TransactionSchema
);

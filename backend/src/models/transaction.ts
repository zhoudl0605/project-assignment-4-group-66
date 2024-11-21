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
            ref: "User", // 引用 User 模型
            required: true,
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order", // 引用 Order 模型
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0, // 确保金额为非负数
        },
        status: {
            type: String,
            enum: ["pending", "completed", "cancelled"], // 限制状态范围
            required: true,
        },
        metadata: {
            type: Schema.Types.Mixed, // 允许存储任意键值对
            default: {}, // 默认值为空对象
        },
    },
    {
        timestamps: true, // 自动生成 createdAt 和 updatedAt
    }
);

export const TransactionModel = mongoose.model<ITransaction>(
    "Transaction",
    TransactionSchema
);

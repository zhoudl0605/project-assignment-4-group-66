import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReview extends Document {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
    rating: number;
    content?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1, // 最小评分
            max: 5, // 最大评分
        },
        content: {
            type: String,
            trim: true, // 去掉多余空格
            maxlength: 500, // 限制内容长度
        },
    },
    {
        timestamps: true, // 自动生成 createdAt 和 updatedAt
    }
);

export const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);

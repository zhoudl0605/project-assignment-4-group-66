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
            min: 1, 
            max: 5, 
        },
        content: {
            type: String,
            trim: true, 
            maxlength: 500,
        },
    },
    {
        timestamps: true, 
    }
);

export const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);

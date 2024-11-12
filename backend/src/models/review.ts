import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    userId: string;
    productId: string;
    rating: number;
    content?: string;
    createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    content: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const RatingModel = mongoose.model<IReview>("Rating", ReviewSchema);

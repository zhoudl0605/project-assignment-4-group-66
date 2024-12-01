import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface IPaymentMethod extends Document {
    userId: Types.ObjectId;
    cardType: string;
    cardNumber: string;
    cardName: string;
    expirationDate: string;
    cvv: string;
    validateCVV: (cvv: string) => Promise<boolean>;
}

const PaymentMethodSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        cardType: {
            type: String,
            required: true,
            enum: ["Visa", "MasterCard", "AmericanExpress"], // 限制卡片类型
        },
        cardNumber: {
            type: String,
            required: true,
            validate: {
                validator: (v: string) => /^\d{16}$/.test(v), // 简单卡号格式验证
                message: (props: any) =>
                    `${props.value} is not a valid card number!`,
            },
        },
        cardName: {
            type: String,
            required: true,
            trim: true,
        },
        expirationDate: {
            type: String,
            required: true,
            validate: {
                validator: (v: string) => /^\d{2}\/\d{2}$/.test(v), // 格式 MM/YY
                message: (props: any) =>
                    `${props.value} is not a valid expiration date!`,
            },
        },
        cvv: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // 自动生成 createdAt 和 updatedAt
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const PaymentMethodModel = mongoose.model<IPaymentMethod>(
    "PaymentMethod",
    PaymentMethodSchema
);

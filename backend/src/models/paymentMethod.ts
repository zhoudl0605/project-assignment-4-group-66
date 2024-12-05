import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface IPaymentMethod extends Document {
    userId: Types.ObjectId;
    cardType?: string;
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
            enum: ["Visa", "MasterCard", "AmericanExpress"], 
        },
        cardNumber: {
            type: String,
            required: true,
            validate: {
                validator: (v: string) => /^\d{16}$/.test(v), 
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
                validator: (v: string) => /^\d{2}\/\d{2}$/.test(v), 
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
        timestamps: true, 
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const PaymentMethodModel = mongoose.model<IPaymentMethod>(
    "PaymentMethod",
    PaymentMethodSchema
);

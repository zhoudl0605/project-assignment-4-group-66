import mongoose, { Schema, Document, Types } from "mongoose";

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface IOrder extends Document {
    userId: Types.ObjectId;
    products: {
        productId: Types.ObjectId;
        quantity: number;
        price: number;
    }[];
    status: OrderStatus;
    subTotal: number;
    tax: number;
    total: number;
}

const OrderSchema: Schema = new Schema(
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
                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            },
        ],
        status: {
            type: String,
            enum: ["pending", "processing", "completed", "cancelled"],
            required: true,
            default: "pending",
        },
        subTotal: {
            type: Number,
            default: 0,
        },
        tax: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

OrderSchema.pre<IOrder>("save", function (next) {
    const subTotal = this.products.reduce(
        (sum, product) => sum + product.quantity * product.price,
        0
    );

    this.subTotal = parseFloat(subTotal.toFixed(2)); // 保留两位小数

    const taxRate = 0.13;
    this.tax = parseFloat((subTotal * taxRate).toFixed(2)); // 保留两位小数

    next();
});

OrderSchema.virtual("total").get(function (this: IOrder) {
    return parseFloat((this.subTotal + this.tax).toFixed(2)); // 保留两位小数
});

export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);

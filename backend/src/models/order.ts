import mongoose, { Schema, Document, Types } from "mongoose";

export type OrderStatus = "pending" | "completed" | "cancelled";

export interface IOrder extends Document {
    userId: Types.ObjectId;
    products: {
        productId: Types.ObjectId;
        quantity: number;
        price: number;
    }[];
    status: OrderStatus;
    subTotal: number; // 每次保存时动态计算
    tax: number; // 每次保存时动态计算
    total: number; // 虚拟字段
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
            enum: ["pending", "completed", "cancelled"],
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
        timestamps: true, // 自动生成 createdAt 和 updatedAt
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

OrderSchema.virtual("total").get(function (this: IOrder) {
    return this.subTotal + this.tax;
});

OrderSchema.pre<IOrder>("save", function (next) {
    const subTotal = this.products.reduce(
        (sum, product) => sum + product.quantity * product.price,
        0
    );

    this.subTotal = subTotal;

    const taxRate = 0.1;
    this.tax = subTotal * taxRate;

    next();
});

export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);

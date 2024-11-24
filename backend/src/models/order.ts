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
    subTotal?: number;
    tax?: number;
    total?: number; // 虚拟字段
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

// 虚拟字段：动态计算订单总金额
OrderSchema.virtual("total").get(function (this: IOrder) {
    const subTotal = this.products.reduce(
        (sum: number, product: { quantity: number; price: number }) => {
            return sum + product.quantity * product.price;
        },
        0
    );
    return subTotal + (this.tax || 0);
});

export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);

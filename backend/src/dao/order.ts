import { IOrder, OrderModel } from "../models/order";
import { DbQueryResult } from "../types";

export class OrderDao {
    async getOrders(
        userId: string | null,
        limit?: number,
        skip?: number
    ): Promise<DbQueryResult<IOrder[]>> {
        const filter = userId ? { userId } : {};
        const query = OrderModel.find(filter);

        if (limit) query.limit(limit);
        if (skip) query.skip(skip);

        const [orders, total] = await Promise.all([
            query.exec(),
            OrderModel.countDocuments(filter),
        ]);

        return {
            data: orders,
            limit,
            skip,
            total,
        };
    }

    async createOrder(order: Partial<IOrder>): Promise<IOrder> {
        const newOrder = new OrderModel(order);
        return await newOrder.save();
    }

    async getOrderById(orderId: string): Promise<IOrder | null> {
        return await OrderModel.findById(orderId).exec();
    }

    async updateOrder(
        orderId: string,
        updateData: Partial<IOrder>
    ): Promise<IOrder | null> {
        const order = await OrderModel.findById(orderId);
        if (!order) {
            throw new Error("Order not found");
        }

        if (updateData.userId) order.userId = updateData.userId;
        if (updateData.products) order.products = updateData.products;
        if (updateData.status) order.status = updateData.status;

        return await order.save();
    }

    async deleteOrder(orderId: string): Promise<IOrder | null> {
        return await OrderModel.findByIdAndDelete(orderId).exec();
    }
}

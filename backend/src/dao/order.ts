import { IOrder, OrderModel } from "../models/order";
import { DbQueryResult } from "../types";

export class OrderDao {
    async getOrders(
        userId: string | null,
        limit: number = 0,
        skip: number = 0
    ): Promise<DbQueryResult<IOrder[]>> {
        const filter = userId ? { userId } : {};
        const query = OrderModel.find(filter);

        if (limit > 0) query.limit(limit);
        if (skip > 0) query.skip(skip);

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
        return await OrderModel.findByIdAndUpdate(orderId, updateData, {
            new: true,
        }).exec();
    }

    async deleteOrder(orderId: string): Promise<IOrder | null> {
        return await OrderModel.findByIdAndDelete(orderId).exec();
    }
}

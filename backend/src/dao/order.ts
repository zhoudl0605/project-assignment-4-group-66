import { IOrder, OrderModel } from "../models/order";
import { UserRole } from "../models/user";
import { DbQueryResult } from "../types";

export class OrderDao {
    async getOrders(
        userId: string | null,
        limit: number = 0,
        skip: number = 0
    ): Promise<DbQueryResult<IOrder[]>> {
        const query = OrderModel.find({
            userId,
        });
        if (limit) query.limit(limit);
        if (skip) query.skip(skip);

        const orders = await query.exec();

        return {
            data: orders,
            limit,
            skip,
            total: orders.length,
        };
    }

    async createOrder(order: IOrder): Promise<IOrder> {
        const newOrder = new OrderModel(order);
        return await newOrder.save();
    }
}

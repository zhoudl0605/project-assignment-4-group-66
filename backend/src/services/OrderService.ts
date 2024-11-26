import { OrderDao } from "../dao/order";
import { IOrder } from "../models/order";
import { UserRole } from "../models/user";
import { DbQueryResult } from "../types";

export class OrderService {
    private orderDao: OrderDao;

    constructor() {
        this.orderDao = new OrderDao();
    }

    public async getOrders(
        userId: string | null,
        limit: number = 0,
        skip: number = 0
    ): Promise<DbQueryResult<IOrder[]>> {
        return await this.orderDao.getOrders(userId, limit, skip);
    }

    public async createOrder(
        userId: string,
        products: { productId: string; quantity: number }[]
    ): Promise<IOrder> {
        // return await this.orderDao.createOrder(userId, products);
        throw new Error("Method not implemented");
    }
}

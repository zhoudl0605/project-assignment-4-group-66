import { Types } from "mongoose";
import { OrderDao } from "../dao/order";
import { IOrder } from "../models/order";
import { ProductModel } from "../models/product";
import { UserRole } from "../models/user";
import { DbQueryResult } from "../types";
import { emailModule } from "../modules/email";
import { UserDao } from "../dao/user";

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
        if (!products || products.length === 0) {
            throw new Error("No products provided for order creation.");
        }

        const populatedProducts = await Promise.all(
            products.map(async (product) => {
                const foundProduct = await ProductModel.findById(
                    product.productId
                ).exec();
                if (!foundProduct) {
                    throw new Error(`Product not found: ${product.productId}`);
                }
                if (product.quantity <= 0) {
                    throw new Error(
                        `Invalid quantity for product: ${product.productId}`
                    );
                }
                if (foundProduct.stock < product.quantity) {
                    throw new Error(
                        `Insufficient stock for product: ${product.productId}`
                    );
                }
                return {
                    productId: foundProduct._id as Types.ObjectId,
                    quantity: product.quantity,
                    price: foundProduct.price,
                };
            })
        );

        const subTotal = populatedProducts.reduce(
            (sum, product) => sum + product.quantity * product.price,
            0
        );
        const taxRate = 0.13;
        const tax = subTotal * taxRate;

        const orderData: Partial<IOrder> = {
            userId: new Types.ObjectId(userId),
            products: populatedProducts,
            subTotal,
            tax,
            status: "pending",
        };

        const createdOrder = await this.orderDao.createOrder(orderData);

        await Promise.all(
            populatedProducts.map(async (product) => {
                await ProductModel.findByIdAndUpdate(product.productId, {
                    $inc: { stock: -product.quantity },
                }).exec();
            })
        );

        return createdOrder;
    }

    public async processOrder(orderId: string): Promise<IOrder | null> {
        const existingOrder = await this.orderDao.getOrderById(orderId);

        if (!existingOrder) {
            throw new Error("Order not found.");
        }

        if (existingOrder.status !== "pending") {
            throw new Error("Order is not in a valid state for processing.");
        }

        const updatedOrder = await this.orderDao.updateOrder(orderId, {
            status: "processing",
        });

        await this.sendOrderConfirmationEmail(
            existingOrder.userId.toString(),
            existingOrder
        );

        return updatedOrder;
    }

    private async sendOrderConfirmationEmail(
        userId: string,
        order: IOrder
    ): Promise<void> {
        const userDao = new UserDao();
        const user = await userDao.getUserById(userId);
        if (!user || !user.email) {
            console.warn(
                `User not found or missing email for userId: ${userId}`
            );
            return;
        }

        const emailContent = `
            Dear ${user.name},
    
            Your order has been successfully processed!
            
            Order Details:
            Order ID: ${order._id}
            SubTotal: ${order.subTotal}
            Tax: ${order.tax}
            Total: ${order.subTotal + order.tax}
    
            Thank you for shopping with us!
    
            Best Regards,
            Your Store Team
        `;

        await emailModule.sendEmail({
            to: user.email,
            subject: "Order Confirmation",
            text: emailContent,
        });
    }

    public async updateOrder(
        orderId: string,
        updateData: Partial<IOrder>
    ): Promise<IOrder | null> {
        const existingOrder = await this.orderDao.getOrderById(orderId);

        if (!existingOrder) {
            throw new Error("Order not found.");
        }

        if (updateData.products && updateData.products.length > 0) {
            // Restore stock for existing products
            await Promise.all(
                existingOrder.products.map(async (product) => {
                    await ProductModel.findByIdAndUpdate(product.productId, {
                        $inc: { stock: product.quantity },
                    }).exec();
                })
            );

            // Process updated products
            const populatedProducts = await Promise.all(
                updateData.products.map(async (product) => {
                    const foundProduct = await ProductModel.findById(
                        product.productId
                    ).exec();
                    if (!foundProduct) {
                        throw new Error(
                            `Product not found: ${product.productId}`
                        );
                    }
                    if (product.quantity <= 0) {
                        throw new Error(
                            `Invalid quantity for product: ${product.productId}`
                        );
                    }
                    if (foundProduct.stock < product.quantity) {
                        throw new Error(
                            `Insufficient stock for product: ${product.productId}`
                        );
                    }
                    return {
                        productId: foundProduct._id as Types.ObjectId,
                        quantity: product.quantity,
                        price: foundProduct.price,
                    };
                })
            );

            // Update stock for new products
            await Promise.all(
                populatedProducts.map(async (product) => {
                    await ProductModel.findByIdAndUpdate(product.productId, {
                        $inc: { stock: -product.quantity },
                    }).exec();
                })
            );

            // Recalculate subTotal, tax, and total
            const subTotal = populatedProducts.reduce(
                (sum, product) => sum + product.quantity * product.price,
                0
            );
            const taxRate = 0.13;
            const tax = subTotal * taxRate;
            const total = subTotal + tax;

            updateData.subTotal = subTotal;
            updateData.tax = tax;
            updateData.products = populatedProducts;
            updateData.total = total;
        }

        // Update order in the database
        const updatedOrder = await this.orderDao.updateOrder(
            orderId,
            updateData
        );

        return updatedOrder;
    }

    public async deleteOrder(orderId: string): Promise<IOrder | null> {
        return await this.orderDao.deleteOrder(orderId);
    }

    public async getOrderById(orderId: string): Promise<IOrder | null> {
        return await this.orderDao.getOrderById(orderId);
    }

    public async payOrder(orderId: string): Promise<IOrder | null> {
        const existingOrder = await this.orderDao.getOrderById(orderId);

        if (!existingOrder) {
            throw new Error("Order not found.");
        }

        if (existingOrder.status !== "processing") {
            throw new Error("Order is not in a valid state for payment.");
        }

        const updatedOrder = await this.orderDao.updateOrder(orderId, {
            status: "completed",
        });
        const user = await new UserDao().getUserById(
            existingOrder.userId.toString()
        );
        const emailContent = `
            Dear ${user!.name},
    
            Your order has been successfully paid!
            
            Order Details:
            Order ID: ${existingOrder._id}
            SubTotal: ${existingOrder.subTotal}
            Tax: ${existingOrder.tax}
            Total: ${existingOrder.subTotal + existingOrder.tax}
    
            Thank you for shopping with us!
    
            Best Regards,
            Your Store Team
        `;
        await emailModule.sendEmail({
            to: user!.email,
            subject: "Order Payment Confirmation",
            text: emailContent,
        });

        return updatedOrder;
    }
}

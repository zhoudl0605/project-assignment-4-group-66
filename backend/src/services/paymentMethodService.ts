import { PaymentMethodDao } from "../dao/paymentMethodDao";
import { IPaymentMethod, PaymentMethodModel } from "../models/paymentMethod";

export class PaymentMethodService {
    public async getPaymentMethods(
        userId: string,
        query: {}
    ): Promise<IPaymentMethod[]> {
        try {
            const paymentMethodDao = new PaymentMethodDao();
            return await paymentMethodDao.getPaymentMethods(userId, query);
        } catch (error: any) {
            console.error("Error fetching payment methods:", error.message);
            throw new Error(
                `Failed to fetch payment methods: ${error.message}`
            );
        }
    }

    public async createPaymentMethod(params: {}): Promise<IPaymentMethod> {
        try {
            return new PaymentMethodModel(params);
        } catch (error: any) {
            console.error("Error creating payment method:", error.message);
            throw new Error(
                `Failed to create payment method: ${error.message}`
            );
        }
    }

    public async getPaymentMethodById(
        id: string
    ): Promise<IPaymentMethod | null> {
        try {
            const paymentMethodDao = new PaymentMethodDao();
            return await paymentMethodDao.getPaymentMethodById(id);
        } catch (error: any) {
            console.error(
                "Error fetching payment method by ID:",
                error.message
            );
            throw new Error(
                `Failed to fetch payment method by ID: ${error.message}`
            );
        }
    }

    public async deletePaymentMethod(
        id: string
    ): Promise<IPaymentMethod | null> {
        try {
            const paymentMethodDao = new PaymentMethodDao();
            return await paymentMethodDao.deletePaymentMethod(id);
        } catch (error: any) {
            console.error("Error deleting payment method:", error.message);
            throw new Error(
                `Failed to delete payment method: ${error.message}`
            );
        }
    }

    public async updatePaymentMethod(
        id: string,
        data: Partial<IPaymentMethod>
    ): Promise<IPaymentMethod | null> {
        try {
            console.log("id", id);
            console.log("data", data);

            const paymentMethodDao = new PaymentMethodDao();
            return await paymentMethodDao.updatePaymentMethod(id, data);
        } catch (error: any) {
            console.error("Error updating payment method:", error.message);
            throw new Error(
                `Failed to update payment method: ${error.message}`
            );
        }
    }
}

import { IPaymentMethod, PaymentMethodModel } from "../models/paymentMethod";
import { DbQueryResult } from "../types";

export class PaymentMethodDao {
    public async getPaymentMethods(
        userId: string | null,
        query: any
    ): Promise<IPaymentMethod[]> {
        const { limit = null, skip = 0, category } = query;
        const filter: any = {};

        if (userId) {
            filter.userId = userId;
        }

        return await PaymentMethodModel.find(filter)
            .limit(Number(limit))
            .skip(Number(skip))
            .exec();
    }

    async postPaymentMethod(
        paymentMethod: IPaymentMethod
    ): Promise<IPaymentMethod> {
        const newPaymentMethod = new PaymentMethodModel(paymentMethod);
        return await newPaymentMethod.save();
    }

    async getPaymentMethodById(id: string): Promise<IPaymentMethod | null> {
        return await PaymentMethodModel.findById(id).exec();
    }

    async updatePaymentMethod(
        id: string,
        data: Partial<IPaymentMethod>
    ): Promise<IPaymentMethod | null> {
        return await PaymentMethodModel.findByIdAndUpdate(id, data, {
            new: true,
        }).exec();
    }

    async deletePaymentMethod(id: string): Promise<IPaymentMethod | null> {
        return await PaymentMethodModel.findByIdAndDelete(id).exec();
    }

    async deleteManyPaymentMethods(
        condition: Record<string, any>
    ): Promise<{ deletedCount?: number }> {
        const result = await PaymentMethodModel.deleteMany(condition).exec();
        return { deletedCount: result.deletedCount };
    }
}

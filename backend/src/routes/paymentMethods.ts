import express from "express";
import { PaymentMethodsController } from "../controllers/paymentMethodsController";

const paymentMethodRouter = express.Router();
paymentMethodRouter.get("/", async (req, res, next) => {
    PaymentMethodsController.getPaymentMethods(req, res, next);
});
paymentMethodRouter.post("/", (req, res, next) => {
    PaymentMethodsController.postPaymentMethod(req, res, next);
});
paymentMethodRouter.get("/:id", (req, res, next) => {
    PaymentMethodsController.getPaymentMethodById(req, res, next);
});
paymentMethodRouter.put("/:id", (req, res, next) => {
    PaymentMethodsController.updatePaymentMethod(req, res, next);
});
paymentMethodRouter.delete("/:id", (req, res, next) => {
    PaymentMethodsController.deletePaymentMethod(req, res, next);
});

export default paymentMethodRouter;
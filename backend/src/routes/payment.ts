import express from "express";
import { PaymentController } from "../controllers/paymentController";

const paymentRouter = express.Router();

paymentRouter.post("/", (req, res, next) => {
    PaymentController.postPaymentMethod(req, res, next);
});

export default paymentRouter;

import express from "express";
import { TestController } from "../controllers/testController";

const testRouter = express.Router();

testRouter.post("/sendTestEmail", (req, res, next) => {
    TestController.sendTestEmail(req, res, next);
});

export default testRouter;

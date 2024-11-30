"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const exceptionsController_1 = require("../controllers/exceptionsController");
const cateRouter = new koa_router_1.default({
    prefix: "/categories",
});
cateRouter.post("/", exceptionsController_1.ExceptionController.unimplemented);
cateRouter.get("/", exceptionsController_1.ExceptionController.unimplemented);
cateRouter.get("/:id", exceptionsController_1.ExceptionController.unimplemented);
exports.default = cateRouter;
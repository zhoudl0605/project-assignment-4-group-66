"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const auth_1 = __importDefault(require("./auth"));
const users_1 = __importDefault(require("./users"));
const shoppingCarts_1 = __importDefault(require("./shoppingCarts"));
const orders_1 = __importDefault(require("./orders"));
const products_1 = __importDefault(require("./products"));
const categories_1 = __importDefault(require("./categories"));
const indexRouter = new koa_router_1.default({});
indexRouter.all("/ping", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = "pong";
}));
const registerRoutes = (app) => {
    app.use(indexRouter.routes());
    app.use(auth_1.default.routes());
    app.use(users_1.default.routes());
    app.use(shoppingCarts_1.default.routes());
    app.use(orders_1.default.routes());
    app.use(products_1.default.routes());
    app.use(categories_1.default.routes());
};
exports.registerRoutes = registerRoutes;

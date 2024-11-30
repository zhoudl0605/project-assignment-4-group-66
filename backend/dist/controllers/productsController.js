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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const productService_1 = require("../services/productService");
class ProductsController {
    static postProductsController(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = ctx.request.body;
            const productService = new productService_1.ProductService();
            try {
                const product = yield productService.createProduct(body);
                // run validation
                let errors = product.validateSync();
                if (errors) {
                    ctx.status = 400;
                    return (ctx.body = {
                        status: "error",
                        message: errors.message,
                    });
                }
                // save the product
                yield product.save();
                return (ctx.body = {
                    status: "success",
                    data: product,
                });
            }
            catch (error) {
                console.error("Error while creating product", error.toString());
                ctx.status = 500;
                ctx.body = {
                    status: "error",
                    message: "Internal server error",
                };
                return;
            }
        });
    }
    static getProductsController(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const productService = new productService_1.ProductService();
            const query = ctx.query;
            try {
                const products = yield productService.getProducts(query);
                return (ctx.body = {
                    status: "success",
                    data: products,
                });
            }
            catch (error) {
                console.error("Error while fetching products", error.toString());
                ctx.status = 500;
                ctx.body = {
                    status: "error",
                    message: "Internal server error",
                };
                return;
            }
        });
    }
}
exports.ProductsController = ProductsController;

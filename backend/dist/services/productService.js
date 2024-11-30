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
exports.ProductService = void 0;
const productDao_1 = require("../dao/productDao");
const product_1 = require("../models/product");
class ProductService {
    createProduct(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return new product_1.ProductModel(params);
            }
            catch (error) {
                // 捕获错误并抛出
                console.error("Error creating product:", error.message);
                throw new Error(`Failed to create product: ${error.message}`);
            }
        });
    }
    getProducts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productDao = new productDao_1.ProductDao();
                return yield productDao.getProducts(query);
            }
            catch (error) {
                console.error("Error creating productDao:", error.message);
            }
            throw new Error("Method not implemented");
        });
    }
}
exports.ProductService = ProductService;

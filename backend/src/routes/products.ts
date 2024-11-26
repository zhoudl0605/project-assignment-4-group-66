import Router from "koa-router";
import Product from "../models/Product";

const productsRouter = new Router({ prefix: "/api/products" });

// 获取所有产品
productsRouter.get("/", async (ctx) => {
    try {
        const products = await Product.find();
        ctx.body = products;
    } catch (error) {
        ctx.status = 500;
        ctx.body = 'Server error';
    }
});

// 根据 SKU 获取特定产品
productsRouter.get("/:sku", async (ctx) => {
    try {
        const product = await Product.findOne({ sku: ctx.params.sku });
        if (!product) {
            ctx.status = 404;
            ctx.body = 'Product not found';
        } else {
            ctx.body = product;
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = 'Server error';
    }
});

export default productsRouter;

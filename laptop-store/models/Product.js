import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    categoryId: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    medias: {
        type: [String],
        required: true,
    },
    specs: {
        type: [{ name: String, value: String }],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Product = model('Product', ProductSchema);
export default Product;

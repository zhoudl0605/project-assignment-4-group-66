// server.js
import express from 'express';
import mongoose from 'mongoose';
import Product from './models/Product.js'; // 这是包含 ProductSchema 的文件

const app = express();
const PORT = 5000;

// 连接到 MongoDB 数据库
mongoose.connect('mongodb://localhost:27017/laptop-store', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

// 定义获取产品详情的 API
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

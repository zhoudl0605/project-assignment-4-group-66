const express = require('express');
const app = express();
const PORT = 5000;
const productRoutes = require('./routes/products'); // 假设子路由文件是 products.js
app.use('/api/products', productRoutes);


// 示例：引入 MongoDB 的 Product 模型（如果有）
const mongoose = require('mongoose');
const Product = require('./models/Product'); // 假设有一个 Product 模型

// 测试数据（如果数据库未配置）
const sampleProducts = [
    { id: 1, name: "Product 1", price: 100, medias: ["https://via.placeholder.com/200"] },
    { id: 2, name: "Product 2", price: 200, medias: ["https://via.placeholder.com/200"] },
];

// 连接 MongoDB（确保数据库连接正常）
mongoose.connect('mongodb://localhost:27017/your-database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// 解析 JSON 请求体
app.use(express.json());

// 定义 `/api/products` 路由
app.get('/api/products', async (req, res) => {
    try {
        // 如果有 MongoDB 数据
        const products = await Product.find(); // 获取 MongoDB 数据
        res.json(products);

        // 或者使用测试数据（如果没有数据库）
        // res.json(sampleProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Server Error');
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

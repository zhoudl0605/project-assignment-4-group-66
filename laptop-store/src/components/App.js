import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Checkout from './Checkout';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import { AppProvider } from './AppContext';

import ProductDetail from './ProductDetail';
import ProductList from './ProductList';
import ShoppingCart from './ShoppingCart';
import Footer from './Footer';

// App 组件
function App() {
    return (
        <AppProvider>
            <Router>
                <div>
                    <Navbar />
                    <Routes>
                        {/* 确保这里的路由路径正确 */}
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/products/desktops" element={<ProductList category="desktops" />} />
                        <Route path="/products/laptops" element={<ProductList category="laptops" />} />
                        <Route path="/products/accessories" element={<ProductList category="accessories" />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<ShoppingCart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </AppProvider>
    );
}

// 渲染根组件
ReactDOM.render(<App />, document.getElementById('root'));

export default App;

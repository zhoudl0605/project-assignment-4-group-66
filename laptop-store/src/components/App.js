import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Checkout from './Checkout';
import Login from './Login';
import Order from './Order';
import OrderList from './OrderList';
import AdminDashboard from './AdminDashboard';
import { AppProvider } from './AppContext';

import ProductDetail from './ProductDetail';
import ProductList from './ProductList';
import ShoppingCart from './ShoppingCart';
import Footer from './Footer';

// Wrapper Component to Use `useNavigate`
function AppWithRouter() {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (query, navigate) => {
        setSearchQuery(query);
        navigate(`/products?search=${query}`);
    };

    return (
        <AppProvider>
            <Router>
                <App handleSearch={handleSearch} searchQuery={searchQuery} />
            </Router>
        </AppProvider>
    );
}

// Main App Component
function App({ handleSearch, searchQuery }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Navbar */}
            <Navbar onSearch={handleSearch} />

            {/* Main Content */}
            <div style={{ flex: 1 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList searchQuery={searchQuery} />} />
                    <Route path="/products/desktops" element={<ProductList category="desktops" />} />
                    <Route path="/products/laptops" element={<ProductList category="laptops" />} />
                    <Route path="/products/accessories" element={<ProductList category="accessories" />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<ShoppingCart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/orders/:id" element={<Order />} />
                    <Route path="/orders" element={<OrderList />} />
                </Routes>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default AppWithRouter;
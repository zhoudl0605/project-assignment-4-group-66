import React, { useState } from 'react';
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
        <div>
            <Navbar onSearch={handleSearch} />
            <Routes>
                {/* Ensure the routes are correct */}
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
            </Routes>
            <Footer />
        </div>
    );
}

// Render Root Component
ReactDOM.render(
    <AppWithRouter />,
    document.getElementById('root')
);

export default AppWithRouter;

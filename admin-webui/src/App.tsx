import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ReactNode } from "react";
import Login from "./pages/Login";
import Order from "./pages/Order";
import Product from "./pages/Product";
import User from "./pages/User";
import Transaction from "./pages/Transaction";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 登录页面 */}
                <Route path="/login" element={<Login />} />

                {/* 私有路由：保护所有其他路由 */}
                <Route
                    path="*"
                    element={
                        <PrivateRoute>
                            <ProtectedRoutes />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

function ProtectedRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/products" element={<Product />} />
            <Route path="/users" element={<User />} />
            <Route path="/transactions" element={<Transaction />} />

            {/* 可以添加更多受保护的路由 */}
        </Routes>
    );
}

function PrivateRoute({
    children,
}: {
    children: ReactNode;
}): JSX.Element | null {
    // get token from local storage
    const token = sessionStorage.getItem("token");
    return token ? <>{children}</> : <Navigate to="/login" />;
}

export default App;

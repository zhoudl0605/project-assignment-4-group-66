import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ReactNode } from "react";
import Login from "./pages/Login";
import Order from "./pages/Order";
import Product from "./pages/Product";
import User from "./pages/User";
import PaymentMethod from "./pages/PaymentMethod";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
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
            <Route path="/" element={<User />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/products" element={<Product />} />
            <Route path="/users" element={<User />} />
            <Route path="/payment-methods" element={<PaymentMethod />} />
            {/* <Route path="/transactions" element={<Transaction />} /> */}
            {/* <Route path="/categories" element={<Category />} /> */}
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

// src/AppContext.js
import React, { createContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // 从 localStorage 中恢复购物车数据
    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
        if (storedCartItems) {
            setCartItems(storedCartItems);
        }
    }, []);

    // 将购物车数据保存到 localStorage
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // 添加商品到购物车
    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingProduct = prevItems.find((item) => item.id === product.id);
            if (existingProduct) {
                const updatedItems = prevItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                console.log('Updated Cart Items:', updatedItems);
                return updatedItems;
            } else {
                const newItems = [...prevItems, { ...product, quantity: 1 }];
                console.log('New Cart Items:', newItems);
                return newItems;
            }
        });
    };

    // 从购物车中移除商品
    const removeFromCart = (productId) => {
        setCartItems((prevItems) => {
            console.log('Removing product with id:', productId); // 添加日志
            const updatedItems = prevItems.filter((item) => item.id !== productId);
            console.log('Updated Cart Items after removal:', updatedItems); // 添加日志
            return updatedItems;
        });
    };


    return (
        <AppContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;

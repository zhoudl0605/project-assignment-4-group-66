// src/AppContext.js
import React, { createContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Restore cart data from localStorage
    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
        if (storedCartItems) {
            setCartItems(storedCartItems);
        }
    }, []);

    // Save cart data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Add a product to the cart
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

    // Remove a product from the cart
    const removeFromCart = (productId) => {
        setCartItems((prevItems) => {
            console.log('Removing product with id:', productId); // Log the ID of the product being removed
            const updatedItems = prevItems.filter((item) => item.id !== productId);
            console.log('Updated Cart Items after removal:', updatedItems); // Log the cart contents after removal
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

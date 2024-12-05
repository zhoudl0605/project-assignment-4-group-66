import React, { createContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
            return Array.isArray(storedCartItems) ? storedCartItems : [];
        } catch (error) {
            console.error('Error parsing cart items from localStorage:', error);
            return [];
        }
    });

    // Save cart data to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } catch (error) {
            console.error('Error saving cart items to localStorage:', error);
        }
    }, [cartItems]);

    // Add a product to the cart
    const addToCart = (product, quantity = 1) => {
        console.log('Adding product to cart:', product, 'Quantity:', quantity);

        setCartItems((prevItems) => {
            const existingProduct = prevItems.find((item) => item.id === product.id);
            if (existingProduct) {
                const updatedItems = prevItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
                console.log('Updated Cart Items:', updatedItems);
                return updatedItems;
            } else {
                const newItems = [...prevItems, { ...product, quantity: quantity }];
                console.log('New Cart Items:', newItems);
                return newItems;
            }
        });
    };

    // Remove a product from the cart
    const removeFromCart = (productId) => {
        setCartItems((prevItems) => {
            console.log('Removing product with id:', productId);
            const updatedItems = prevItems.filter((item) => item.id !== productId);
            console.log('Updated Cart Items after removal:', updatedItems);
            return updatedItems;
        });
    };

    // Clear the cart
    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <AppContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
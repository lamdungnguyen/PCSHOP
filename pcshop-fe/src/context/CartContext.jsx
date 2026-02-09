import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem('cart');
        return localData ? JSON.parse(localData) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1, variant = null) => {
        setCartItems((prevItems) => {
            const cartItemId = variant ? `${product.id}-${variant.id}` : product.id;
            const existingItem = prevItems.find((item) => item.id === cartItemId);

            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === cartItemId ? { ...item, qty: item.qty + quantity } : item
                );
            }

            const item = {
                id: cartItemId,
                productId: product.id,
                name: variant ? `${product.name} (${variant.color})` : product.name,
                price: variant ? variant.price : product.price,
                imageUrl: variant && variant.imageUrl ? variant.imageUrl : product.imageUrl,
                qty: quantity,
                variantId: variant ? variant.id : null
            };

            return [...prevItems, item];
        });
        alert("Added to cart!");
    };

    const removeFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === id) {
                    const newQty = Math.max(1, item.qty + delta);
                    return { ...item, qty: newQty };
                }
                return item;
            })
        );
    };

    const clearCart = () => setCartItems([]);

    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};

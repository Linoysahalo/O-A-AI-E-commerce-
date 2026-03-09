import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNotification } from "./NotificationContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    try {
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("שגיאה בטעינת העגלה מה-Storage", e);
      return [];
    }
  });

  const { showMessage } = useNotification();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, removeFromWishlistFn = null) => {

    const normalizedItem = {
      ...item,

      displayDescription: item.Description || item.description || item.Category || "אין תיאור זמין",
      displayName: item.Name || item.name || "מוצר ללא שם",
      displayPrice: item.Price || item.price || 0,
      displayId: item.ID || item._id || item.id
    };

    setCartItems((prev) => {
      const itemId = normalizedItem.displayId;
      const existing = prev.find((product) => (product.ID || product._id || product.id) === itemId);

      if (existing) {
        return prev.map((product) =>
          (product.ID || product._id || product.id) === itemId
            ? { ...product, quantity: (product.quantity || 1) + 1 }
            : product
        );
      }
      return [...prev, { ...normalizedItem, quantity: 1 }];
    });

    if (removeFromWishlistFn) {
      removeFromWishlistFn(normalizedItem.displayId);
    }

    showMessage("המוצר נוסף לעגלה");
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => (item.ID || item._id || item.id) !== id));
    showMessage("המוצר הוסר מהעגלה");
  };

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        (item.ID || item._id || item.id) === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };


  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.displayPrice || 0) * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
import React, {createContext, useState, useContext, useEffect} from 'react';
import {useNotification} from "./NotificationContext";

export const WishlistContext = createContext();

export function WishlistProvider({children}){
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    try {
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (e) {
      console.error("שגיאה בטעינת ה-Wishlist מהזיכרון", e);
      return [];
    }
  });

  const {showMessage} = useNotification();

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const getInternalId = (item) => item.ID || item._id;

  const addToWishlist = (item) => {
    const itemId = getInternalId(item);

    if (!wishlistItems.some((i) => getInternalId(i) === itemId)) {
      setWishlistItems((prev) => [...prev, item]);
      showMessage("המוצר נוסף לרשימת המשאלות");
    } else {
      showMessage("המוצר כבר נמצא ברשימת המשאלות");
    }
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) =>
      prev.filter((item) => {
        const currentItemId = getInternalId(item);
        return String(currentItemId) !== String(id);
      })
    );
    showMessage("המוצר הוסר מרשימת המשאלות");
  };

  const moveToCart = (item, addToCart) => {
    const itemId = getInternalId(item);
    removeFromWishlist(itemId);
    addToCart(item);
    showMessage("המוצר הועבר לעגלה");
  };

  return (
    <WishlistContext.Provider
      value={{wishlistItems, addToWishlist, removeFromWishlist, moveToCart}}
    >
      {children}
    </WishlistContext.Provider>
  );
}
import React, { useContext } from "react";
import { WishlistContext } from "../context/wishlistContext";
import { CartContext } from "../context/cartContext";
import { Link } from "react-router-dom";
import removeIcon from "../assets/remove.png";
import "./wishlist.css";

function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">רשימת המשאלות שלי</h1>
      {wishlistItems.length === 0 ? (
        <p className="wishlist-empty">עדיין לא הוספת פריטים לרשימה 🖤</p>
      ) : (
        <>
          <div className="wishlist-list">
            {wishlistItems.map((item) => {
              const itemId = item.ID || item._id;

              return (
                <div className="wishlist-item" key={itemId}>
                  <img src={item.pic} alt={item["Full name"]} className="wishlist-img" />

                  <div className="wishlist-info">
                    <h4 className="brand-name">{item["Brand Name"]}</h4>

                    {/* שם מוצר מלא (לא מקוצר) */}
                    <h3 className="full-product-name">{item["Full name"]}</h3>

                    {/* תיאור המוצר */}
                    <p className="desc">{item.Description}</p>

                    {/* מחיר - נשאר כפי שהיה */}
                    <p className="price">₪{item.Price || item.price}</p>
                  </div>

                  <div className="wishlist-actions">
                    <button className="add-to-cart" onClick={() => addToCart(item)}>
                      הוספה לסל
                    </button>
                    <button className="remove-wishlist" onClick={() => removeFromWishlist(itemId)}>
                      <img src={removeIcon} alt="הסר" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="wishlist-buttons">
            <Link to="/" className="back-to-store">חזרה לחנות</Link>
          </div>
        </>
      )}
    </div>
  );
}

export default WishlistPage;
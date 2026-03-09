import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import wishlistIcon from "../assets/wishlist.png";
import wishlistIconHover from "../assets/wishlist2.png";
import cartIcon from "../assets/shopping-cart.png";
import removeIcon from "../assets/remove.png";
import userIcon from "../assets/user.png";
import searchIcon from "../assets/search.png";
import { CartContext } from "../context/cartContext";
import { AuthContext } from "../context/authContext";

function Navbar() {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const { user, logout, isAuthenticated } = useContext(AuthContext);

  const [wishlistHover, setWishlistHover] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const cartRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();


  const totalCartItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.Price || item.price || 0) * (item.quantity || 1), 0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) setShowCartDropdown(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="right-icons">
        <Link to="/search" className="nav-icon-link">
          <img src={searchIcon} alt="Search" className="search-icon" />
        </Link>

        <div className="user-wrapper" ref={userRef}>
          <div className="user-trigger" onClick={() => setShowUserDropdown(!showUserDropdown)}>
            <img src={userIcon} alt="User" className="user-icon" />
          </div>

          {showUserDropdown && (
            <div className="user-dropdown">
              {isAuthenticated && user ? (
                <>
                  <p className="welcome-msg">שלום, {user.name || user.Name}</p>
                  <button className="dropdown-btn" onClick={() => { setShowUserDropdown(false); navigate("/user"); }}>החשבון שלי</button>
                  <button className="dropdown-btn logout" onClick={() => { logout(); setShowUserDropdown(false); }}>התנתק</button>
                </>
              ) : (
                <>
                  <p className="welcome-msg_guest">שלום, אורח</p>
                  <button className="dropdown-btn" onClick={() => { setShowUserDropdown(false); navigate("/login"); }}>התחברות / הרשמה</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="left-icons">
        <Link to="/wishlist" className="nav-icon-link">
          <img
            src={wishlistHover ? wishlistIconHover : wishlistIcon} alt="Wishlist" className="wishlist-icon"
            onMouseEnter={() => setWishlistHover(true)}
            onMouseLeave={() => setWishlistHover(false)}
          />
        </Link>
        <div className="cart-wrapper" ref={cartRef}>
          <div className="cart-trigger" onClick={() => setShowCartDropdown(!showCartDropdown)}>
            <img src={cartIcon} alt="Cart" className="cart-icon" />
            {totalCartItems > 0 && <span className="cart-count">{totalCartItems}</span>}
          </div>

          {showCartDropdown && (
            <div className="cart-dropdown">
              {cartItems.length === 0 ? (
                <p className="empty-msg">העגלה ריקה</p>
              ) : (
                <>
                  <div className="cart-items-container">
                    {cartItems.map((item) => {
                      const itemId = item.ID || item._id;
                      return (
                        <div className="cart-dropdown-item" key={itemId}>
                          <img src={item.pic} alt={item.Name} />
                          <div className="cart-item-info">
                            {/* --- הסדר החדש שביקשת --- */}
                            <h5 className="brand-label">{item["Brand Name"]}</h5>
                            <h4>{item.Name}</h4>
                            <p className="cart-desc">{item.Description}</p>
                            <p>₪{(item.Price || item.price) * (item.quantity || 1)}</p>
                            {/* ------------------------- */}
                            <div className="counter">
                              <button onClick={() => updateQuantity(itemId, (item.quantity || 1) - 1)}>-</button>
                              <span>{item.quantity || 1}</span>
                              <button onClick={() => updateQuantity(itemId, (item.quantity || 1) + 1)}>+</button>
                            </div>
                          </div>
                          <button className="remove-btn" onClick={() => removeFromCart(itemId)}>
                            <img src={removeIcon} alt="הסר" className="remove-icon" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="cart-dropdown-actions">
                    <p>סה"כ: ₪{totalPrice}</p>
                    <button onClick={() => { setShowCartDropdown(false); navigate("/checkout"); }}>סיכום הזמנה</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
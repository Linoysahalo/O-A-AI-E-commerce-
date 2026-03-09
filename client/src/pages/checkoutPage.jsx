import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/cartContext";
import { AuthContext } from "../context/authContext";
import removeIcon from "../assets/remove.png";
import { useNavigate } from "react-router-dom";
import "./checkoutPage.css";
import axios from "axios";

function CheckoutPage() {
  const { cartItems, totalPrice, clearCart, removeFromCart, updateQuantity } = useContext(CartContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    delivery: "regular",
  });

  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setForm({
        name: user.name || user.Name || "",
        email: user.email || user.Email || "",
        phone: user.phone || user.Phone || "",
        address: user.address || user.Address || "",
        delivery: "regular",
      });
      setShowForm(true);
    }
  }, [isAuthenticated, user]);

  const formChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    const formattedItems = cartItems.map((item) => ({
      productID: (item.ID || item._id).toString(),
      name: item["Full name"] || item.Name,
      brand: item["Brand Name"],
      price: item.Price,
      quantity: item.quantity,
      pic: item.pic,
    }));

    try {
      await axios.post(`${API_URL}/orders/`, {
        ...form,
        items: formattedItems,
        totalPrice,
        userEmail: isAuthenticated ? (user.email || user.Email) : form.email
      });
      setSuccess(true);
      clearCart();
    } catch (err) {
      alert("שגיאה בשליחה");
      console.error(err);
    }
  };

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">השלמת הזמנה</h2>
      {cartItems.length > 0 && !success && (
        <div className="cart-list">
          {cartItems.map((item) => {
            const itemId = item.ID || item._id;
            return (
              <div className="cart-item-card" key={itemId}>
                <img src={item.pic} alt={item["Full name"]} className="cart-img" />
                <div className="item-info-wrapper">
                  <h4 className="brand-name">{item["Brand Name"]}</h4>
                  <h3 className="full-name">{item["Full name"] || item.Name}</h3>
                  <p className="item-desc">{item.Description}</p>
                </div>

                <div className="cart-summary">
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(itemId, item.quantity - 1)}>-</button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => updateQuantity(itemId, item.quantity + 1)}>+</button>
                  </div>
                  <p className="unit-price">מחיר ליחידה: ₪{item.Price}</p>
                  <p className="total-item-price">סה״כ: ₪{item.Price * (item.quantity || 1)}</p>
                </div>

                <button onClick={() => removeFromCart(itemId)} className="remove-btn">
                  <img src={removeIcon} alt="הסר" className="remove-icon" />
                </button>
              </div>
            );
          })}
          <div className="cart-total">
            <h3>סה"כ לתשלום: ₪{totalPrice}</h3>
          </div>
        </div>
      )}

      {success ? (
        <div className="success-container">
           <p className="success-msg">ההזמנה בוצעה בהצלחה! 🎉</p>
           <button onClick={() => navigate("/")} className="back-home-btn">חזרה לדף הבית</button>
        </div>
      ) : (
        <>
          {!isAuthenticated && !showForm ? (
            <div className="auth-step">
              <h3>איך תרצה להמשיך?</h3>
              <div className="auth-options">
                <button
                  className="login-btn"
                  onClick={() => navigate("/login", { state: { from: "/checkout" } })}>
                  התחברות / הרשמה
                </button>
                <button className="guest-btn" onClick={() => setShowForm(true)}>
                  המשך כאורח
                </button>
              </div>
            </div>
          ) : (
            <form className="checkout-form" onSubmit={formSubmit}>
              <label>שם מלא:</label>
              <input type="text" name="name" value={form.name} onChange={formChange} required />

              <label>אימייל:</label>
              <input type="email" name="email" value={form.email} onChange={formChange} required />

              <label>טלפון:</label>
              <input type="tel" name="phone" value={form.phone} onChange={formChange} required />

              <label>כתובת:</label>
              <textarea name="address" value={form.address} onChange={formChange} required />

              <label>סוג משלוח:</label>
              <div className="radio-group">
                <label>
                  <input type="radio" name="delivery" value="regular" checked={form.delivery === "regular"} onChange={formChange} />
                  רגיל (עד 7 ימי עסקים)
                </label>
                <label>
                  <input type="radio" name="delivery" value="express" checked={form.delivery === "express"} onChange={formChange} />
                  אקספרס (3-4 ימי עסקים)
                </label>
              </div>

              <p className="total-display">סה"כ לתשלום: ₪{totalPrice}</p>
              <button type="submit" className="submit-order-btn">בצע הזמנה</button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export default CheckoutPage;
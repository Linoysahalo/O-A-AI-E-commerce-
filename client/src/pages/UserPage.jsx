import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import "./UserPage.css";

function UserPage() {
  const { user, isAuthenticated, updateUserInfo } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", phone: "", address: "" });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (isAuthenticated && user) {
      setEditData({ name: user.name, phone: user.phone || "", address: user.address || "" });

      axios.get(`${API_URL}/orders/history/${user.email}`)
        .then((res) => {
          setOrders(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching orders:", err);
          setLoading(false);
        });
    }
  }, [isAuthenticated, user]);

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/auth/update`, { email: user.email, ...editData });
      alert("הפרטים עודכנו בהצלחה!");
      setIsEditing(false);
      if (updateUserInfo) updateUserInfo(editData);
    } catch (err) {
      alert("שגיאה בעדכון הפרטים");
    }
  };

  if (!isAuthenticated) return <div className="user-page-msg">אנא התחבר כדי לצפות בפרטים.</div>;

  return (
    <div className="user-page-container">
      <header className="user-header">
        <h1>החשבון שלי</h1>
        <p>שלום, <strong>{user?.name}</strong>. כאן ניתן לנהל את הפרופיל ולעקוב אחר הזמנות.</p>
      </header>

      <div className="user-grid">
        <section className="profile-card">
          <div className="card-header">
            <h3>פרטים אישיים</h3>
            <button className="edit-toggle" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "ביטול" : "עריכה"}
            </button>
          </div>

          <div className="profile-content">
            {isEditing ? (
              <div className="edit-form">
                <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} placeholder="שם מלא" />
                <input type="tel" value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})} placeholder="טלפון" />
                <textarea value={editData.address} onChange={(e) => setEditData({...editData, address: e.target.value})} placeholder="כתובת קבועה" />
                <button className="save-btn" onClick={handleUpdate}>שמור שינויים</button>
              </div>
            ) : (
              <>
                <div className="info-row"><span> <b> אימייל: </b> </span><span>{user?.email}</span></div>
                <div className="info-row"><span> <b> טלפון:</b> </span><span>{user?.phone || "לא הוזן"}</span></div>
                <div className="info-row"><span> <b> כתובת: </b> </span><span>{user?.address || "לא הוזנה"}</span></div>
              </>
            )}
          </div>
        </section>

        <section className="orders-section">
          <h3>היסטוריית הזמנות</h3>
          {loading ? (
            <p className="loading-msg">טוען הזמנות...</p>
          ) : orders.length === 0 ? (
            <p className="empty-orders">אין הזמנות קודמות.</p>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="detailed-order-card">
                  <div className="order-top-bar">
                    <div className="order-id">הזמנה #{order._id.slice(-6)}</div>
                    <div className="order-date">
                       {new Date(order.createdAt).toLocaleDateString('he-IL', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="order-status-badge">הושלמה</div>
                  </div>

                  <div className="order-items-list">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item-row">
                        <div className="item-img-container">
                           <img src={item.pic} alt={item.name} />
                           <span className="qty-badge">{item.quantity}</span>
                        </div>
                        <div className="item-details">
                          <span className="item-name">{item.name}</span>
                          <span className="item-price">₪{item.price} ליחידה</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <span className="total-label">סה"כ לתשלום:</span>
                    <span className="total-amount">₪{order.totalPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default UserPage;
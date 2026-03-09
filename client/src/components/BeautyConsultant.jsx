import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { CartContext } from "../context/cartContext";
import { WishlistContext } from "../context/wishlistContext";
import './beautyConsultant.css';

const BeautyConsultant = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  const messagesEndRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/`);
        setAllProducts(res.data);
      } catch (err) {
        console.error("Amber dictionary error:", err);
      }
    };
    fetchProducts();
  }, [API_URL]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const renderMessageWithCards = (msg) => {
    if (msg.role === 'user') return <p className="message-text">{msg.content}</p>;

    const idRegex = /\[PRODUCT[-_ ]?ID:\s*([\w-]+)\]/gi;
    const matches = [...msg.content.matchAll(idRegex)];
    const cleanText = msg.content.replace(idRegex, "").trim();

    return (
      <>
        <p className="message-text">{cleanText}</p>
        {matches.length > 0 && (
          <div className="mini-products-grid">
            {matches.map((match, idx) => {
              const extractedId = match[1].trim().toLowerCase();
              const product = allProducts.find(p =>
                String(p.ID || p.id || p._id).trim().toLowerCase() === extractedId
              );

              if (!product) return null;

              return (
                <div key={idx} className="amber-product-card">
                  <div className="card-image-box">
                    <img src={product.pic || product.image} alt={product.Name} />
                    <button
                      className="card-wishlist-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToWishlist(product);
                        console.log("Added to Wishlist context!");
                      }}
                    >
                      ❤
                    </button>
                  </div>

                  <div className="card-data-box">
                    <span className="card-brand">{product.brand || "Oak & Amber"}</span>
                    <h4 className="card-name">{product.Name || product.name}</h4>
                    <div className="card-price-container">
                      <span className="card-price">{product.Price || product.price} ₪</span>
                    </div>
                    <button className="card-add-btn" onClick={() => addToCart(product)}>
                      הוספה לסל
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  };

  const handleAsk = async () => {
    if (!query.trim()) return;
    const userQuery = query;
    const historyForAI = messages.map(m => ({ role: m.role, content: m.content }));
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chat/recommend`, {
        query: userQuery,
        history: historyForAI
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "חלה שגיאה בתקשורת." }]);
    }
    setLoading(false);
  };

  return (
    <div className={`chat-consultant ${!isOpen ? 'closed' : ''}`}>
      <div className="chat-header" onClick={() => setIsOpen(!isOpen)}>
        <h3>יועצת יופי אישית - Amber</h3>
        <span className="toggle-icon">{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && (
        <>
          <div className="response-area">
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.role}`}>
                <div className="chat-bubble">
                  {renderMessageWithCards(msg)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message-wrapper assistant">
                <div className="chat-bubble loading">Amber בודקת...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-area">
            <input
              type="text"
              placeholder="איך אוכל לעזור?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
            />
            <button onClick={handleAsk} disabled={loading}>שלחי</button>
          </div>
        </>
      )}
    </div>
  );
};

export default BeautyConsultant;
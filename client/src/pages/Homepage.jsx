import axios from 'axios';
import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/cartContext";
import { WishlistContext } from "../context/wishlistContext";
import wishlistIcon from "../assets/wishlist.png";
import wishlistIconHover from "../assets/wishlist2.png";
import bannerImg from "../assets/banner.webp";
import "./Homepage.css";

function Homepage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const [hoveredItemId, setHoveredItemId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/products/`);
        let rawData = response.data;

        if (typeof rawData === 'string') {
          const cleanedData = rawData.replace(/:NaN/g, ':null');
          try {
            rawData = JSON.parse(cleanedData);
          } catch (parseError) {
            console.error("נכשל בפענוח הנתונים גם אחרי ניקוי:", parseError);
          }
        }

        const finalData = Array.isArray(rawData) ? rawData : (rawData?.products || []);
        setProducts(finalData);

      } catch (err) {
        console.error("שגיאה בטעינת מוצרים:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  return (
    <>
      <div className="banner-container">
        <img src={bannerImg} alt="באנר" className="banner-image" />
      </div>

      <div className="home-container">
        <div className="about-us">
          <h2>יופי שנובע מהטבע</h2>
          <p>אנחנו מאמינים שטיפוח הוא רגע של שקט בתוך היום. בחרנו עבורך את המותגים המובילים מקוריאה, המשלבים מסורת רבת שנים עם טכנולוגיה מודרנית, כדי להעניק לעורך את הטוב ביותר</p>
        </div>

        <div className="products-grid">
          {loading ? (
            <p>טוען את הקולקציה...</p>
          ) : products.length > 0 ? (
            products.slice(0, 12).map((product) => (
              <div className="product-card" key={product.ID || product._id || Math.random()}>
                <div className="wishlist-icon-wrapper">
                  <img
                    src={hoveredItemId === (product._id || product.ID) ? wishlistIconHover : wishlistIcon}
                    alt="משאלות"
                    className="wishlist-icon"
                    onClick={() => addToWishlist(product)}
                    onMouseEnter={() => setHoveredItemId(product._id || product.ID)}
                    onMouseLeave={() => setHoveredItemId(null)}
                  />
                </div>
                <img
                  src={product.pic || 'https://via.placeholder.com/300'}
                  alt={product.Name}
                  className="product-img"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
                />
                <div className="product-info">
                  {/* --- הסדר החדש שביקשת --- */}
                  <h4 className="brand-name">{product["Brand Name"]}</h4>
                  <h3 className="product-name">{product.Name}</h3>
                  <p className="desc">{product.Description || product.Category}</p>
                  <p className="price">₪{product.Price}</p>
                  {/* ------------------------- */}
                </div>
                <button onClick={() => addToCart(product)}>הוסף לעגלה</button>
              </div>
            ))
          ) : (
            <p>לא נמצאו מוצרים להצגה. (בדקי את ה-Collection במונגו)</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Homepage;
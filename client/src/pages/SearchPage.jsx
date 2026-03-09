import React, { useState, useEffect } from "react";
import axios from "axios";
import "./searchPage.css";

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/products/search?q=${searchTerm}`);
      setResults(res.data);
    } catch (err) {
      console.error("Search error", err);
    }
    setLoading(false);
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>חיפוש באתר</h1>
        <input
          type="text"
          placeholder="חפשי מותג, מוצר, קטגוריה או רכיב..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
      </div>

      <div className="search-results">
        {loading && <p className="loading-msg">מחפש עבורך את הטוב ביותר...</p>}
        {!loading && results.length === 0 && searchTerm && (
          <p className="no-results">אופס.. לא נמצאו פריטים התואמים לחיפוש שלך! נסי מילות מפתח אחרות</p>
        )}

        <div className="products-grid">
          {results.map((product) => (
            <div key={product.ID || product._id} className="search-product-card">
              <img
                src={product.pic || 'https://via.placeholder.com/300'}
                alt={product.Name}
                className="product-img"
              />
              <div className="product-info">
                <h4 className="brand-name">{product["Brand Name"]}</h4>

                {/* שם המוצר */}
                <h3 className="product-name">{product.Name}</h3>

                {/* תיאור המוצר */}
                <p className="desc">{product.Description || product.Category}</p>

                {/* מחיר */}
                <p className="price">₪{product.Price || product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
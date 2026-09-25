import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import StarRating from "./StarRating";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user) { navigate("/login"); return; }
    setAdding(true);
    const result = await addToCart(product._id);
    setAdding(false);
    if (result?.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const discountPct = product.discount || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="card product-card" onClick={() => navigate(`/products/${product._id}`)} style={{ cursor: "pointer" }}>
      <div className="product-card__image-wrap">
        <img
          src={product.image || `https://via.placeholder.com/300x200/e8f5e9/2e7d32?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="product-card__image"
          onError={(e) => { e.target.src = `https://via.placeholder.com/300x200/e8f5e9/2e7d32?text=${encodeURIComponent(product.name)}`; }}
        />
        {discountPct > 0 && <span className="product-card__badge">{discountPct}% OFF</span>}
        {product.stock === 0 && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>Out of Stock</span>
          </div>
        )}
      </div>
      <div className="product-card__body">
        <div className="product-card__category">{product.category}</div>
        <div className="product-card__name">{product.name}</div>
        <div className="product-card__unit">per {product.unit}</div>
        <div className="product-card__rating">
          <StarRating value={Math.round(product.rating)} readonly size="0.85rem" />
          <span>({product.reviewCount})</span>
        </div>
        <div className="product-card__price-row">
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span className="product-card__price">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="product-card__original">₹{product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
      <div className="product-card__footer">
        <button
          className={`btn btn-full btn-sm ${added ? "btn-secondary" : "btn-primary"}`}
          onClick={handleAddToCart}
          disabled={adding || product.stock === 0}
          id={`add-to-cart-${product._id}`}
        >
          {adding ? "Adding..." : added ? "✓ Added!" : "🛒 Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

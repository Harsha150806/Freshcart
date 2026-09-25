import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const StarRating = ({ rating, count }) => {
  return (
    <div className="product-card-rating">
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= Math.round(rating) ? 'star-filled' : 'star-empty'}
            style={{ fontSize: '0.85rem' }}
          >
            ★
          </span>
        ))}
      </div>
      {count > 0 && <span className="rating-count">({count})</span>}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      {/* Badges */}
      <div className="product-card-badge">
        {product.isOffer && (
          <span className="badge badge-offer">🔥 {product.discount}% OFF</span>
        )}
        {product.isFeatured && !product.isOffer && (
          <span className="badge badge-featured">⭐ Featured</span>
        )}
        {product.stock === 0 && (
          <span className="badge badge-out">Out of Stock</span>
        )}
      </div>

      {/* Image */}
      <div className="product-card-img-wrap">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="product-card-img"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Grocery+Item';
            }}
          />
        </Link>
      </div>

      {/* Body */}
      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <Link to={`/products/${product._id}`} className="product-card-name">
          {product.name}
        </Link>
        {product.brand && <span className="product-card-brand">{product.brand} · {product.weight}</span>}
        <StarRating rating={product.rating} count={product.numReviews} />
        <div className="product-card-price">
          <span className="price-current">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="price-original">₹{product.originalPrice}</span>
          )}
          {product.discount > 0 && (
            <span className="price-discount">{product.discount}% off</span>
          )}
          <span className="price-unit">/ {product.unit}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="product-card-footer">
        <Link to={`/products/${product._id}`} className="btn btn-ghost btn-sm">
          Details
        </Link>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => addToCart(product._id)}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : '+ Add'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

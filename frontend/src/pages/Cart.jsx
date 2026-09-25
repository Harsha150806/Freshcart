import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  const items = cart?.items || [];
  const subtotal = cartTotal;
  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">🔒</div>
            <h3>Please login to view your cart</h3>
            <p>You need to be logged in to access your shopping cart.</p>
            <Link to="/login" className="btn btn-primary btn-lg">Login Now</Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">🛍️</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any items yet. Start shopping!</p>
            <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">🛍️ My Cart</h1>
            <div className="breadcrumb">
              <Link to="/">Home</Link> / <span>Cart</span>
            </div>
          </div>
          <button className="btn btn-outline-danger btn-sm" onClick={clearCart}>
            🗑️ Clear Cart
          </button>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="card">
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 700 }}>Cart Items ({items.length})</h3>
            </div>
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;
              return (
                <div key={item._id} className="cart-item">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="cart-item-img"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=Item'; }}
                  />
                  <div className="cart-item-info">
                    <Link to={`/products/${product._id}`} className="cart-item-name">{product.name}</Link>
                    <div className="cart-item-price">₹{item.price} / {product.unit}</div>
                    {product.stock < 10 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.2rem' }}>
                        Only {product.stock} left!
                      </div>
                    )}
                  </div>
                  <div className="cart-item-actions">
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      >−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={item.quantity >= product.stock}
                      >+</button>
                    </div>
                    <div className="cart-item-total">₹{(item.price * item.quantity).toFixed(0)}</div>
                    <button
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.1rem', padding: '0.25rem', borderRadius: 'var(--radius-sm)', transition: 'var(--transition)' }}
                      onClick={() => removeFromCart(item._id)}
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="order-summary-title">Order Summary</div>

            <div className="summary-row">
              <span>Subtotal ({items.length} items)</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span className={deliveryFee === 0 ? 'free' : ''}>
                {deliveryFee === 0 ? 'FREE 🎉' : `₹${deliveryFee}`}
              </span>
            </div>
            {deliveryFee > 0 && (
              <div style={{ background: '#fff7ed', borderRadius: 'var(--radius)', padding: '0.65rem', fontSize: '0.8rem', color: '#c2410c', border: '1px solid #fed7aa', margin: '0.5rem 0' }}>
                🚚 Add ₹{(500 - subtotal).toFixed(0)} more to get <strong>FREE delivery!</strong>
              </div>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(0)}</span>
            </div>

            <div style={{ margin: '1rem 0' }}>
              <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '0.75rem', border: '1px solid var(--border)' }}>
                <input
                  className="form-input"
                  placeholder="Coupon code (FRESH25)"
                  style={{ flex: 1, padding: '0.5rem' }}
                />
                <button className="btn btn-outline btn-sm">Apply</button>
              </div>
            </div>

            <Link to="/checkout" className="btn btn-primary btn-block btn-lg">
              Proceed to Checkout →
            </Link>
            <Link to="/products" className="btn btn-ghost btn-block" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
              ← Continue Shopping
            </Link>

            {/* Trust badges */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-around' }}>
              {['🔒 Secure', '🚚 Fast', '↩️ Easy Returns'].map((badge) => (
                <span key={badge} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{badge}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

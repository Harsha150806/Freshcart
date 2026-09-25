import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import LoadingSpinner from "../components/LoadingSpinner";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, cartCount, loading, DELIVERY_FEE, updateQuantity, removeFromCart, clearCart } = useCart();

  const subtotal = cart.totalAmount || 0;
  const discount = subtotal > 499 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal - discount + DELIVERY_FEE;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="cart-page">
      <div className="page-hero" style={{ padding: "2rem 0" }}>
        <div className="container">
          <h1>Shopping Cart</h1>
          <div className="breadcrumb"><a href="/">Home</a><span>/</span><span>Cart</span></div>
        </div>
      </div>

      <div className="container" style={{ marginTop: "2rem" }}>
        {cart.items?.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🛒</div>
            <h3 className="empty-state__title">Your cart is empty</h3>
            <p className="empty-state__sub">Add some fresh groceries to get started!</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate("/products")}>🛒 Shop Now</button>
          </div>
        ) : (
          <div className="cart-grid">
            {/* Items */}
            <div>
              <div className="card" style={{ overflow: "visible" }}>
                <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--gray-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Cart Items ({cartCount})</h2>
                  <button className="btn btn-danger btn-sm" onClick={clearCart}>🗑 Clear All</button>
                </div>
                {cart.items?.map(item => {
                  const p = item.product;
                  if (!p) return null;
                  return (
                    <div key={item._id || p._id} className="cart-item">
                      <img src={p.image || `https://via.placeholder.com/90x90/e8f5e9/2e7d32?text=${encodeURIComponent(p.name)}`}
                        alt={p.name} className="cart-item__image"
                        onError={e => { e.target.src = `https://via.placeholder.com/90x90/e8f5e9/2e7d32?text=${encodeURIComponent(p.name)}`; }} />
                      <div className="cart-item__info">
                        <div className="cart-item__name">{p.name}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--gray-500)", margin: "2px 0 6px" }}>{p.category} · per {p.unit}</div>
                        <div className="cart-item__price">₹{p.price} <span style={{ fontSize: "0.8rem", color: "var(--gray-500)", fontWeight: 400 }}>× {item.quantity} = ₹{p.price * item.quantity}</span></div>
                        <div className="qty-control" style={{ marginTop: "0.5rem" }}>
                          <button className="qty-btn" onClick={() => updateQuantity(p._id, item.quantity - 1)}>−</button>
                          <span className="qty-value">{item.quantity}</span>
                          <button className="qty-btn" onClick={() => updateQuantity(p._id, item.quantity + 1)}>+</button>
                          <button className="btn btn-sm" style={{ color: "var(--red)", background: "none", marginLeft: "0.5rem" }} onClick={() => removeFromCart(p._id)}>Remove</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <div className="cart-summary__title">Order Summary</div>
              <div className="cart-summary__row"><span>Subtotal</span><span>₹{subtotal}</span></div>
              {discount > 0 && <div className="cart-summary__row" style={{ color: "var(--primary)" }}><span>Discount (5%)</span><span>−₹{discount}</span></div>}
              <div className="cart-summary__row">
                <span>Delivery Fee</span>
                {DELIVERY_FEE === 0 ? <span style={{ color: "var(--primary)" }}>FREE</span> : <span>₹{DELIVERY_FEE}</span>}
              </div>
              {DELIVERY_FEE > 0 && <p style={{ fontSize: "0.78rem", color: "var(--primary)", marginBottom: "0.5rem" }}>🎉 Add ₹{499 - subtotal > 0 ? 499 - subtotal : 0} more for free delivery!</p>}
              <div className="cart-summary__row total"><span>Total</span><span>₹{total}</span></div>
              <button id="proceed-to-checkout" className="btn btn-primary btn-full btn-lg" style={{ marginTop: "1rem" }} onClick={() => navigate("/checkout")}>Proceed to Checkout →</button>
              <button className="btn btn-ghost btn-full btn-sm" style={{ marginTop: "0.5rem" }} onClick={() => navigate("/products")}>Continue Shopping</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

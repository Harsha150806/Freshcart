import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { addressAPI } from "../services/api";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, DELIVERY_FEE } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const subtotal = cart.totalAmount || 0;
  const discount = subtotal > 499 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal - discount + DELIVERY_FEE;

  useEffect(() => {
    addressAPI.getAll().then(r => {
      setAddresses(r.data);
      const def = r.data.find(a => a.isDefault) || r.data[0];
      if (def) setSelectedAddress(def._id);
    }).catch(() => {});
  }, []);

  const handleContinue = () => {
    if (!selectedAddress && addresses.length > 0) { alert("Please select a delivery address"); return; }
    const addr = addresses.find(a => a._id === selectedAddress);
    navigate("/payment", { state: { address: addr, subtotal, discount, deliveryFee: DELIVERY_FEE, total } });
  };

  return (
    <div>
      <div className="page-hero" style={{ padding: "2rem 0" }}>
        <div className="container">
          <h1>Checkout</h1>
          <div className="breadcrumb"><a href="/">Home</a><span>/</span><a href="/cart">Cart</a><span>/</span><span>Checkout</span></div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: "2rem" }}>
        <div className="container">
          {/* Steps */}
          <div className="checkout-steps">
            {["Address", "Payment", "Confirm"].map((s, i) => (
              <div key={s} className="step">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div className={`step__circle ${i === 0 ? "active" : ""}`}>{i + 1}</div>
                  <div className="step__label">{s}</div>
                </div>
                {i < 2 && <div className="step__line"></div>}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "2rem" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Select Delivery Address</h2>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate("/address")}>+ Add Address</button>
              </div>

              {addresses.length === 0 ? (
                <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
                  <p style={{ color: "var(--gray-500)", marginBottom: "1rem" }}>No saved addresses found.</p>
                  <button className="btn btn-primary" onClick={() => navigate("/address")}>+ Add Delivery Address</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {addresses.map(addr => (
                    <div key={addr._id} className="card" style={{ padding: "1.25rem", border: selectedAddress === addr._id ? "2px solid var(--primary)" : "2px solid var(--gray-200)", cursor: "pointer" }} onClick={() => setSelectedAddress(addr._id)}>
                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        <input type="radio" readOnly checked={selectedAddress === addr._id} style={{ marginTop: "4px" }} />
                        <div>
                          <div style={{ fontWeight: 700, marginBottom: "4px" }}>{addr.fullName} {addr.isDefault && <span className="badge badge-success" style={{ marginLeft: "6px" }}>Default</span>}</div>
                          <div style={{ fontSize: "0.85rem", color: "var(--gray-600)", lineHeight: 1.6 }}>
                            {addr.house}, {addr.street}, {addr.area}<br />{addr.city}, {addr.state} - {addr.pincode}<br />📞 {addr.mobile}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <div className="cart-summary__title">Order Summary</div>
              {cart.items?.slice(0, 3).map(item => item.product && (
                <div key={item._id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.5rem", color: "var(--gray-600)" }}>
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
              {cart.items?.length > 3 && <p style={{ fontSize: "0.8rem", color: "var(--gray-400)" }}>+{cart.items.length - 3} more items</p>}
              <hr className="divider" />
              <div className="cart-summary__row"><span>Subtotal</span><span>₹{subtotal}</span></div>
              {discount > 0 && <div className="cart-summary__row" style={{ color: "var(--primary)" }}><span>Discount</span><span>−₹{discount}</span></div>}
              <div className="cart-summary__row"><span>Delivery</span><span>{DELIVERY_FEE === 0 ? "FREE" : `₹${DELIVERY_FEE}`}</span></div>
              <div className="cart-summary__row total"><span>Total</span><span>₹{total}</span></div>
              <button id="continue-to-payment" className="btn btn-primary btn-full btn-lg" style={{ marginTop: "1rem" }} onClick={handleContinue} disabled={addresses.length === 0}>Continue to Payment →</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;

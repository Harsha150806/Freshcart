import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { orderAPI } from "../services/api";
import { useCart } from "../context/CartContext";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, fetchCart } = useCart();
  const { address, subtotal, discount, deliveryFee, total } = location.state || {};

  const [method, setMethod] = useState("COD");
  const [processing, setProcessing] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number:"", name:"", expiry:"", cvv:"" });
  const [error, setError] = useState("");

  if (!address) {
    navigate("/checkout");
    return null;
  }

  const handlePlaceOrder = async () => {
    setError("");
    // Simulated payment validation
    if (method === "UPI" && !upiId.includes("@")) { setError("Please enter a valid UPI ID (e.g., yourname@upi)"); return; }
    if (method === "Card") {
      if (card.number.replace(/\s/g,"").length < 16) { setError("Enter a valid 16-digit card number"); return; }
      if (!card.name.trim()) { setError("Enter cardholder name"); return; }
      if (!card.expiry) { setError("Enter expiry date"); return; }
      if (card.cvv.length < 3) { setError("Enter valid CVV"); return; }
    }

    setProcessing(true);
    try {
      const orderData = {
        products: cart.items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          quantity: item.quantity,
        })),
        totalAmount: total,
        deliveryFee,
        discount,
        deliveryAddress: address,
        paymentMethod: method,
      };
      const res = await orderAPI.create(orderData);
      await fetchCart();
      navigate("/order-confirmation", { state: { order: res.data } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally { setProcessing(false); }
  };

  const METHODS = [
    { id:"COD", icon:"💵", label:"Cash on Delivery", sub:"Pay when your order arrives" },
    { id:"UPI", icon:"📱", label:"UPI Payment", sub:"Google Pay, PhonePe, Paytm" },
    { id:"Card", icon:"💳", label:"Credit / Debit Card", sub:"Visa, Mastercard, RuPay" },
    { id:"NetBanking", icon:"🏦", label:"Net Banking", sub:"All major banks supported" },
  ];

  return (
    <div>
      <div className="page-hero" style={{ padding:"2rem 0" }}>
        <div className="container">
          <h1>Payment</h1>
          <div className="breadcrumb"><a href="/">Home</a><span>/</span><a href="/cart">Cart</a><span>/</span><a href="/checkout">Checkout</a><span>/</span><span>Payment</span></div>
        </div>
      </div>

      <section className="section" style={{ paddingTop:"2rem" }}>
        <div className="container">
          {/* Steps */}
          <div className="checkout-steps">
            {["Address","Payment","Confirm"].map((s,i) => (
              <div key={s} className="step">
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <div className={`step__circle ${i===1?"active":i<1?"done":""}`}>{i===0?"✓":i+1}</div>
                  <div className="step__label">{s}</div>
                </div>
                {i<2 && <div className={`step__line ${i<1?"done":""}`}></div>}
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:"2rem" }}>
            <div>
              {/* Delivery address recap */}
              <div className="card" style={{ padding:"1.25rem", marginBottom:"1.5rem", background:"var(--primary-bg)", border:"none" }}>
                <div style={{ fontWeight:700, marginBottom:"0.4rem" }}>📍 Delivering to: {address.fullName}</div>
                <div style={{ fontSize:"0.85rem", color:"var(--gray-700)" }}>{address.house}, {address.street}, {address.area}, {address.city} – {address.pincode}</div>
              </div>

              {/* Payment Methods */}
              <h2 style={{ fontSize:"1.05rem", fontWeight:700, marginBottom:"1rem" }}>Select Payment Method</h2>
              {error && <div className="alert alert-error">{error}</div>}

              <div className="payment-methods">
                {METHODS.map(m => (
                  <div key={m.id} className={`payment-option ${method===m.id?"selected":""}`} onClick={() => setMethod(m.id)}>
                    <input type="radio" name="payment" readOnly checked={method===m.id} />
                    <div className="payment-option__icon">{m.icon}</div>
                    <div><div className="payment-option__label">{m.label}</div><div className="payment-option__sub">{m.sub}</div></div>
                  </div>
                ))}
              </div>

              {/* UPI form */}
              {method==="UPI" && (
                <div className="card" style={{ padding:"1.25rem", marginTop:"1rem" }}>
                  <p style={{ fontWeight:600, marginBottom:"0.75rem" }}>⚠ Demo UPI Payment</p>
                  <div className="form-group">
                    <label className="form-label">UPI ID</label>
                    <input className="form-control" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
                  </div>
                  <p style={{ fontSize:"0.8rem", color:"var(--gray-500)" }}>This is a simulated payment. No real money will be deducted.</p>
                </div>
              )}

              {/* Card form */}
              {method==="Card" && (
                <div className="card" style={{ padding:"1.25rem", marginTop:"1rem" }}>
                  <p style={{ fontWeight:600, marginBottom:"0.75rem" }}>⚠ Demo Card Payment</p>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input className="form-control" placeholder="1234 5678 9012 3456" value={card.number} maxLength={19}
                      onChange={e => { const v=e.target.value.replace(/\D/g,"").slice(0,16); setCard({...card,number:v.replace(/(.{4})/g,"$1 ").trim()}); }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cardholder Name</label>
                    <input className="form-control" placeholder="JOHN DOE" value={card.name} onChange={e => setCard({...card,name:e.target.value.toUpperCase()})} />
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                    <div className="form-group">
                      <label className="form-label">Expiry</label>
                      <input className="form-control" placeholder="MM/YY" value={card.expiry} maxLength={5}
                        onChange={e => { const v=e.target.value.replace(/\D/g,""); setCard({...card,expiry:v.length>2?v.slice(0,2)+"/"+v.slice(2):v}); }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input className="form-control" placeholder="123" type="password" value={card.cvv} maxLength={4} onChange={e => setCard({...card,cvv:e.target.value.replace(/\D/g,"")})} />
                    </div>
                  </div>
                  <p style={{ fontSize:"0.8rem", color:"var(--gray-500)" }}>🔒 This is a demo. No real payment processing occurs.</p>
                </div>
              )}

              {method==="NetBanking" && (
                <div className="card" style={{ padding:"1.25rem", marginTop:"1rem" }}>
                  <p style={{ fontWeight:600, marginBottom:"0.75rem" }}>⚠ Demo Net Banking</p>
                  <p style={{ fontSize:"0.85rem", color:"var(--gray-600)" }}>In a real application, you would be redirected to your bank's portal. This is a simulated payment for the college project.</p>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <div className="cart-summary__title">Order Total</div>
              <div className="cart-summary__row"><span>Subtotal</span><span>₹{subtotal}</span></div>
              {discount>0 && <div className="cart-summary__row" style={{color:"var(--primary)"}}><span>Discount</span><span>−₹{discount}</span></div>}
              <div className="cart-summary__row"><span>Delivery</span><span>{deliveryFee===0?"FREE":`₹${deliveryFee}`}</span></div>
              <div className="cart-summary__row total"><span>Grand Total</span><span>₹{total}</span></div>
              <button id="place-order-btn" className="btn btn-primary btn-full btn-lg" style={{ marginTop:"1rem" }} onClick={handlePlaceOrder} disabled={processing}>
                {processing ? "Processing..." : `Pay ₹${total} →`}
              </button>
              <p style={{ fontSize:"0.75rem", color:"var(--gray-500)", textAlign:"center", marginTop:"0.75rem" }}>🔒 Secure SSL encrypted payment</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Payment;

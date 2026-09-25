import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Cash on Delivery', icon: '💵' },
  { id: 'UPI', label: 'UPI / GPay', icon: '📱' },
  { id: 'Credit Card', label: 'Credit Card', icon: '💳' },
  { id: 'Debit Card', label: 'Debit Card', icon: '🏦' },
  { id: 'Net Banking', label: 'Net Banking', icon: '🖥️' },
  { id: 'Wallet', label: 'Wallet', icon: '👛' },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [notes, setNotes] = useState('');

  const items = cart?.items || [];
  const subtotal = cartTotal;
  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  // Pre-fill from user profile if available
  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setAddress(defaultAddr);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">🔒</div>
            <h3>Please login to checkout</h3>
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
            <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill in all address fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        deliveryAddress: address,
        paymentMethod,
        notes,
      });
      toast.success('🎉 Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Checkout</h1>
            <div className="breadcrumb">
              <Link to="/">Home</Link> / <Link to="/cart">Cart</Link> / <span>Checkout</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '2rem', background: 'white', borderRadius: 'var(--radius-lg)', padding: '1rem 1.5rem', border: '1px solid var(--border)' }}>
          {[
            { num: 1, label: 'Delivery Address' },
            { num: 2, label: 'Payment Method' },
            { num: 3, label: 'Review & Place Order' },
          ].map((s, i) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: s.num <= step + 1 ? 'pointer' : 'default',
                }}
                onClick={() => s.num < step && setStep(s.num)}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                  background: step >= s.num ? 'var(--primary)' : 'var(--border)',
                  color: step >= s.num ? 'white' : 'var(--text-muted)',
                }}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: step >= s.num ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {s.label}
                </span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: '2px', background: step > s.num ? 'var(--primary)' : 'var(--border)', margin: '0 0.75rem' }} />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          {/* Left: Steps */}
          <div>
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="checkout-section">
                <div className="checkout-section-title">
                  <span className="step-num">1</span>
                  Delivery Address
                </div>

                {/* Saved addresses */}
                {user.addresses?.length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>Saved Addresses</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {user.addresses.map((addr, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius)',
                            border: `1.5px solid ${JSON.stringify(address) === JSON.stringify(addr) ? 'var(--primary)' : 'var(--border)'}`,
                            background: JSON.stringify(address) === JSON.stringify(addr) ? 'var(--primary-light)' : 'white',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            fontSize: '0.875rem',
                          }}
                          onClick={() => setAddress(addr)}
                        >
                          <strong>{addr.label}</strong>: {addr.street}, {addr.city}, {addr.state} – {addr.pincode}
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.75rem 0' }}>Or enter a new address:</p>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Address Label</label>
                    <select className="form-select" value={address.label} onChange={(e) => setAddress({ ...address, label: e.target.value })}>
                      <option>Home</option>
                      <option>Office</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Street Address *</label>
                    <input
                      className="form-input"
                      placeholder="House/Flat no., Street, Landmark"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input className="form-input" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input className="form-input" placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Pincode *</label>
                    <input className="form-input" placeholder="Pincode" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} required maxLength={6} />
                  </div>
                </div>
                <button className="btn btn-primary btn-block btn-lg" onClick={() => setStep(2)}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="checkout-section">
                <div className="checkout-section-title">
                  <span className="step-num">2</span>
                  Payment Method
                </div>
                <div className="payment-methods">
                  {PAYMENT_METHODS.map((pm) => (
                    <div
                      key={pm.id}
                      className={`payment-method-card ${paymentMethod === pm.id ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod(pm.id)}
                    >
                      <span className="icon">{pm.icon}</span>
                      <span className="label">{pm.label}</span>
                      {paymentMethod === pm.id && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>✓ Selected</span>
                      )}
                    </div>
                  ))}
                </div>

                {paymentMethod === 'COD' && (
                  <div className="alert alert-info" style={{ marginTop: '1rem' }}>
                    <span>💵</span> Pay in cash when your order is delivered. No advance payment needed.
                  </div>
                )}
                {paymentMethod !== 'COD' && (
                  <div className="alert alert-success" style={{ marginTop: '1rem' }}>
                    <span>🔒</span> Your payment is secured with SSL encryption. You'll be redirected to complete payment after placing order.
                  </div>
                )}

                <div className="form-group" style={{ marginTop: '1.25rem' }}>
                  <label className="form-label">Order Notes (Optional)</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Any special instructions for delivery..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ minHeight: '80px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => setStep(3)}>
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="checkout-section">
                <div className="checkout-section-title">
                  <span className="step-num">3</span>
                  Review Your Order
                </div>

                {/* Address review */}
                <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>📍 Delivery Address</p>
                    <button className="btn btn-ghost btn-sm" onClick={() => setStep(1)}>Edit</button>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    <strong>{address.label}:</strong> {address.street}, {address.city}, {address.state} – {address.pincode}
                  </p>
                </div>

                {/* Payment review */}
                <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>💳 Payment: {paymentMethod}</p>
                    <button className="btn btn-ghost btn-sm" onClick={() => setStep(2)}>Edit</button>
                  </div>
                </div>

                {/* Items review */}
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>🛒 Items ({items.length})</p>
                  {items.map((item) => (
                    <div key={item._id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                      <img src={item.product?.image} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                      <div style={{ flex: 1, fontSize: '0.88rem' }}>
                        <div style={{ fontWeight: 600 }}>{item.product?.name}</div>
                        <div style={{ color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                  <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
                  <button
                    className="btn btn-primary btn-lg"
                    style={{ flex: 1 }}
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? '⏳ Placing Order...' : '✅ Place Order – ₹' + total.toFixed(0)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="order-summary">
            <div className="order-summary-title">Order Summary</div>
            {items.slice(0, 3).map((item) => (
              <div key={item._id} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.65rem' }}>
                <img src={item.product?.image} alt="" style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} />
                <div style={{ flex: 1, fontSize: '0.82rem' }}>
                  <div style={{ fontWeight: 600, lineHeight: 1.3 }}>{item.product?.name}</div>
                  <div style={{ color: 'var(--text-muted)' }}>× {item.quantity}</div>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary)' }}>₹{(item.price * item.quantity).toFixed(0)}</div>
              </div>
            ))}
            {items.length > 3 && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                +{items.length - 3} more items
              </p>
            )}
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.75rem 0' }} />
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span className={deliveryFee === 0 ? 'free' : ''}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(0)}</span>
            </div>

            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--primary-light)', borderRadius: 'var(--radius)', fontSize: '0.8rem', color: 'var(--primary-dark)' }}>
              🗓️ Estimated delivery: <strong>2–3 business days</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

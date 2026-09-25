import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const statusColors = {
  Placed: 'status-placed',
  Confirmed: 'status-confirmed',
  Packed: 'status-packed',
  'Out for Delivery': 'status-out',
  Delivered: 'status-delivered',
  Cancelled: 'status-cancelled',
};

const STEPS = ['Placed', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered'];

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const { data } = await api.put(`/orders/${orderId}/cancel`);
      setOrders(orders.map((o) => (o._id === orderId ? data : o)));
      if (selected?._id === orderId) setSelected(data);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">🔒</div>
            <h3>Please login to view orders</h3>
            <Link to="/login" className="btn btn-primary btn-lg">Login Now</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="page-wrapper"><div className="container spinner-wrapper"><div className="spinner" /></div></div>;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">📦 My Orders</h1>
            <div className="breadcrumb">
              <Link to="/">Home</Link> / <span>Orders</span>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No orders yet</h3>
            <p>You haven't placed any orders. Start shopping!</p>
            <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: '2rem', alignItems: 'start' }}>
            {/* Orders list */}
            <div>
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-card-header">
                    <div>
                      <div className="order-id">#{order._id.slice(-8).toUpperCase()}</div>
                      <div className="order-date">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    <span className={`order-status-badge ${statusColors[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="order-card-body">
                    <div className="order-items-preview">
                      {order.items.map((item) => (
                        <img
                          key={item._id}
                          src={item.image}
                          alt={item.name}
                          className="order-item-thumb"
                          title={item.name}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/60?text=Item'; }}
                        />
                      ))}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}:&nbsp;
                      {order.items.map((i) => i.name).slice(0, 2).join(', ')}
                      {order.items.length > 2 && ` +${order.items.length - 2} more`}
                    </p>
                  </div>

                  <div style={{ padding: '0 1.5rem' }}>
                    <div className="order-card-footer">
                      <div>
                        <div className="order-total">₹{order.totalAmount.toFixed(0)}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {order.paymentMethod} · {order.paymentStatus}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setSelected(selected?._id === order._id ? null : order)}
                        >
                          {selected?._id === order._id ? 'Hide Details' : 'View Details'}
                        </button>
                        {['Placed', 'Confirmed'].includes(order.orderStatus) && (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleCancel(order._id)}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Detail Panel */}
            {selected && (
              <div className="card" style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 1.5rem)' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Order Details</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
                </div>

                <div style={{ padding: '1.25rem 1.5rem' }}>
                  {/* Progress tracker */}
                  {selected.orderStatus !== 'Cancelled' && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>ORDER TRACKING</p>
                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', height: '2px', background: 'var(--border)', zIndex: 0 }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                          {STEPS.map((s, i) => {
                            const currentIdx = STEPS.indexOf(selected.orderStatus);
                            const done = i <= currentIdx;
                            return (
                              <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                                <div style={{
                                  width: '28px', height: '28px', borderRadius: '50%',
                                  background: done ? 'var(--primary)' : 'white',
                                  border: done ? 'none' : '2px solid var(--border)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '0.75rem', color: done ? 'white' : 'var(--text-muted)', fontWeight: 700,
                                }}>
                                  {done ? '✓' : i + 1}
                                </div>
                                <span style={{ fontSize: '0.65rem', color: done ? 'var(--primary)' : 'var(--text-muted)', fontWeight: done ? 600 : 400, textAlign: 'center', maxWidth: '55px', lineHeight: 1.2 }}>
                                  {s}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {selected.orderStatus === 'Cancelled' && (
                    <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                      <span>❌</span> This order has been cancelled.
                    </div>
                  )}

                  {/* Items */}
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>ITEMS</p>
                  {selected.items.map((item) => (
                    <div key={item._id} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.65rem' }}>
                      <img src={item.image} alt="" style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/44'; }} />
                      <div style={{ flex: 1, fontSize: '0.82rem' }}>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div style={{ color: 'var(--text-muted)' }}>× {item.quantity} × ₹{item.price}</div>
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>₹{(item.price * item.quantity).toFixed(0)}</div>
                    </div>
                  ))}

                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />

                  {/* Address */}
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>DELIVERY ADDRESS</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.65 }}>
                    {selected.deliveryAddress.street}, {selected.deliveryAddress.city},<br />
                    {selected.deliveryAddress.state} – {selected.deliveryAddress.pincode}
                  </p>

                  {/* Totals */}
                  <div>
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>₹{selected.subtotal?.toFixed(0)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Delivery</span>
                      <span>{selected.deliveryFee === 0 ? 'FREE' : `₹${selected.deliveryFee}`}</span>
                    </div>
                    {selected.discount > 0 && (
                      <div className="summary-row" style={{ color: 'var(--primary)' }}>
                        <span>Discount</span>
                        <span>−₹{selected.discount}</span>
                      </div>
                    )}
                    <div className="summary-row total">
                      <span>Total Paid</span>
                      <span>₹{selected.totalAmount?.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

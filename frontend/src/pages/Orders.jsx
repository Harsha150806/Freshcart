import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "../services/api";
import OrderTracker from "../components/OrderTracker";
import LoadingSpinner from "../components/LoadingSpinner";

const STATUS_BADGE = {
  "Pending":"badge-warning","Confirmed":"badge-info","Packed":"badge-info",
  "Out for Delivery":"badge-warning","Delivered":"badge-success","Cancelled":"badge-danger"
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    orderAPI.getMyOrders().then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Cancel this order?")) return;
    try {
      const r = await orderAPI.cancel(id);
      setOrders(prev => prev.map(o => o._id===id ? r.data : o));
    } catch (err) { alert(err.response?.data?.message || "Cannot cancel this order"); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-hero" style={{ padding:"2rem 0" }}>
        <div className="container"><h1>My Orders</h1><div className="breadcrumb"><a href="/">Home</a><span>/</span><span>Orders</span></div></div>
      </div>
      <section className="section" style={{ paddingTop:"2rem" }}>
        <div className="container">
          {orders.length===0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">📦</div>
              <h3 className="empty-state__title">No orders yet</h3>
              <p className="empty-state__sub">Your placed orders will appear here</p>
              <button className="btn btn-primary btn-lg" onClick={() => navigate("/products")}>🛒 Start Shopping</button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
              {orders.map(order => (
                <div key={order._id} className="card" style={{ overflow:"visible" }}>
                  <div style={{ padding:"1.25rem", display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"0.75rem" }}>
                    <div>
                      <div style={{ fontWeight:700 }}>Order #{order.orderNumber}</div>
                      <div style={{ fontSize:"0.82rem", color:"var(--gray-500)", marginTop:"3px" }}>
                        {new Date(order.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})} · {order.products.length} item{order.products.length>1?"s":""}
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                      <span className={`badge ${STATUS_BADGE[order.orderStatus]||"badge-gray"}`}>{order.orderStatus}</span>
                      <span style={{ fontWeight:700, color:"var(--primary-dark)" }}>₹{order.totalAmount}</span>
                    </div>
                  </div>

                  {/* Products preview */}
                  <div style={{ padding:"0 1.25rem 1rem", borderTop:"1px solid var(--gray-100)" }}>
                    <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", marginTop:"0.75rem" }}>
                      {order.products.slice(0,4).map((p,i) => (
                        <div key={i} style={{ fontSize:"0.82rem", background:"var(--gray-50)", padding:"4px 10px", borderRadius:"var(--radius-full)", color:"var(--gray-700)" }}>
                          {p.name} × {p.quantity}
                        </div>
                      ))}
                      {order.products.length>4 && <span style={{ fontSize:"0.82rem", color:"var(--gray-400)" }}>+{order.products.length-4} more</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ padding:"0.75rem 1.25rem", borderTop:"1px solid var(--gray-100)", display:"flex", gap:"0.75rem", background:"var(--gray-50)" }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setExpanded(expanded===order._id?null:order._id)}>
                      {expanded===order._id?"▲ Hide Tracker":"▼ Track Order"}
                    </button>
                    <span style={{ fontSize:"0.82rem", color:"var(--gray-500)", display:"flex", alignItems:"center" }}>
                      {order.paymentMethod} · {order.paymentStatus}
                    </span>
                    {["Pending","Confirmed"].includes(order.orderStatus) && (
                      <button className="btn btn-danger btn-sm" style={{ marginLeft:"auto" }} onClick={() => handleCancel(order._id)}>Cancel Order</button>
                    )}
                  </div>

                  {/* Tracker */}
                  {expanded===order._id && (
                    <div style={{ padding:"1.25rem", borderTop:"1px solid var(--gray-200)" }}>
                      <OrderTracker status={order.orderStatus} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Orders;

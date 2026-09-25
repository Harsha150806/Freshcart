import { useLocation, useNavigate } from "react-router-dom";
import OrderTracker from "../components/OrderTracker";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  if (!order) { navigate("/orders"); return null; }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth:700 }}>
        <div className="card" style={{ padding:"2.5rem", textAlign:"center" }}>
          <div style={{ fontSize:"4rem", marginBottom:"1rem" }}>🎉</div>
          <h1 style={{ color:"var(--primary-dark)", marginBottom:"0.5rem" }}>Order Placed Successfully!</h1>
          <p style={{ color:"var(--gray-500)", marginBottom:"0.25rem" }}>Thank you for shopping with FreshCart</p>
          <p style={{ color:"var(--gray-600)", fontWeight:600 }}>Order #{order.orderNumber}</p>

          <div className="alert alert-success" style={{ marginTop:"1.5rem", textAlign:"left" }}>
            <strong>📦 What's next?</strong><br/>
            You will receive a confirmation SMS/email. Your order will be packed and delivered soon!
          </div>

          {/* Order Details */}
          <div className="card" style={{ padding:"1.25rem", marginTop:"1.5rem", textAlign:"left", background:"var(--gray-50)", boxShadow:"none" }}>
            <h3 style={{ marginBottom:"1rem", fontSize:"0.95rem" }}>Order Details</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem", fontSize:"0.85rem" }}>
              <div><div style={{ color:"var(--gray-500)" }}>Order ID</div><div style={{ fontWeight:600 }}>{order.orderNumber}</div></div>
              <div><div style={{ color:"var(--gray-500)" }}>Total Amount</div><div style={{ fontWeight:600, color:"var(--primary-dark)" }}>₹{order.totalAmount}</div></div>
              <div><div style={{ color:"var(--gray-500)" }}>Payment</div><div style={{ fontWeight:600 }}>{order.paymentMethod}</div></div>
              <div><div style={{ color:"var(--gray-500)" }}>Payment Status</div><span className={`badge ${order.paymentStatus==="Paid"?"badge-success":"badge-warning"}`}>{order.paymentStatus}</span></div>
              <div style={{ gridColumn:"1/-1" }}><div style={{ color:"var(--gray-500)" }}>Delivery to</div><div style={{ fontWeight:600 }}>{order.deliveryAddress?.fullName}, {order.deliveryAddress?.city}</div></div>
            </div>
          </div>

          {/* Tracker */}
          <div className="card" style={{ padding:"1.5rem", marginTop:"1.25rem", textAlign:"left", boxShadow:"none", border:"1px solid var(--gray-200)" }}>
            <h3 style={{ marginBottom:"1rem", fontSize:"0.95rem" }}>Order Tracker</h3>
            <OrderTracker status={order.orderStatus} />
          </div>

          <div style={{ display:"flex", gap:"1rem", justifyContent:"center", marginTop:"2rem", flexWrap:"wrap" }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate("/orders")}>📦 View My Orders</button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate("/products")}>🛒 Continue Shopping</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderConfirmation;

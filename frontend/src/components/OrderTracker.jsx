const STEPS = [
  { status: "Confirmed", icon: "✓", label: "Order Confirmed", sub: "Your order has been placed" },
  { status: "Packed", icon: "📦", label: "Order Packed", sub: "Items are being packed" },
  { status: "Out for Delivery", icon: "🚚", label: "Out for Delivery", sub: "On the way to you" },
  { status: "Delivered", icon: "🎉", label: "Delivered", sub: "Enjoy your groceries!" },
];

const ORDER_FLOW = ["Pending", "Confirmed", "Packed", "Out for Delivery", "Delivered"];

const OrderTracker = ({ status }) => {
  const currentIdx = ORDER_FLOW.indexOf(status);

  if (status === "Cancelled") {
    return (
      <div style={{ textAlign: "center", padding: "1rem", color: "var(--red)", fontWeight: 600 }}>
        ❌ Order Cancelled
      </div>
    );
  }

  return (
    <div className="order-tracker">
      {STEPS.map((step, i) => {
        const stepIdx = ORDER_FLOW.indexOf(step.status);
        const isDone = currentIdx > stepIdx;
        const isActive = currentIdx === stepIdx;
        const isLast = i === STEPS.length - 1;

        return (
          <div key={step.status} className="tracker-step">
            <div className="tracker-step__left">
              <div className={`tracker-dot ${isDone || isActive ? (isActive ? "active" : "done") : ""}`}></div>
              {!isLast && <div className={`tracker-line ${isDone ? "done" : ""}`}></div>}
            </div>
            <div className="tracker-step__content">
              <div className="tracker-step__title" style={{ color: isDone || isActive ? "var(--primary-dark)" : "var(--gray-400)" }}>
                {step.icon} {step.label}
              </div>
              <div className="tracker-step__sub">{step.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTracker;

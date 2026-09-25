import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer__grid">
        {/* Brand */}
        <div>
          <div className="footer__logo">🛒 Fresh<span>Cart</span></div>
          <p className="footer__desc">Your one-stop destination for fresh groceries delivered right to your doorstep. Quality products, affordable prices, and lightning-fast delivery.</p>
          <div className="footer__social">
            <button className="social-btn" title="Facebook">📘</button>
            <button className="social-btn" title="Instagram">📸</button>
            <button className="social-btn" title="Twitter">🐦</button>
            <button className="social-btn" title="YouTube">▶️</button>
          </div>
        </div>
        {/* Quick Links */}
        <div>
          <h4 className="footer__title">Quick Links</h4>
          <ul className="footer__links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/offers">Offers & Deals</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>
        {/* Customer */}
        <div>
          <h4 className="footer__title">Customer</h4>
          <ul className="footer__links">
            <li><Link to="/profile">My Account</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/contact">Customer Support</Link></li>
            <li><a href="#">Return Policy</a></li>
          </ul>
        </div>
        {/* Info */}
        <div>
          <h4 className="footer__title">Information</h4>
          <ul className="footer__links">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Delivery Information</a></li>
            <li><a href="#">Payment Methods</a></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
          <div style={{ marginTop: "1.25rem" }}>
            <p style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginBottom: "0.4rem" }}>We Accept:</p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {["💳 Visa", "💳 Mastercard", "📱 UPI", "🏦 NetBanking"].map(m => (
                <span key={m} style={{ background: "var(--gray-700)", padding: "3px 8px", borderRadius: 4, fontSize: "0.72rem", color: "var(--gray-300)" }}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© 2024 FreshCart. All rights reserved.</span>
        <span>🌿 Made with love for fresh groceries • Hyderabad, Telangana</span>
        <span style={{ color: "var(--primary-light)" }}>🚀 College Project – MERN Stack</span>
      </div>
    </div>
  </footer>
);

export default Footer;

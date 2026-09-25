import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand-name">
              🛒 Fresh<span>Cart</span>
            </div>
            <p className="footer-description">
              Your one-stop online grocery store. Fresh produce, dairy, bakery, and
              everything you need delivered right to your doorstep.
            </p>
            <div className="footer-social">
              {['📘', '🐦', '📸', '▶️'].map((icon, i) => (
                <button key={i} className="social-btn" title="Social">{icon}</button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="footer-heading">Quick Links</p>
            <div className="footer-links">
              <Link to="/">🏠 Home</Link>
              <Link to="/products">🛒 Shop Now</Link>
              <Link to="/offers">🏷️ Today's Offers</Link>
              <Link to="/orders">📦 Track Orders</Link>
              <Link to="/contact">📞 Contact Us</Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="footer-heading">Categories</p>
            <div className="footer-links">
              <Link to="/products?category=Fruits & Vegetables">🥦 Fruits & Veggies</Link>
              <Link to="/products?category=Dairy & Eggs">🥛 Dairy & Eggs</Link>
              <Link to="/products?category=Bakery">🍞 Bakery</Link>
              <Link to="/products?category=Meat & Seafood">🥩 Meat & Seafood</Link>
              <Link to="/products?category=Beverages">🧃 Beverages</Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <p className="footer-heading">Stay Updated</p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem', lineHeight: 1.65 }}>
              Subscribe for exclusive deals, seasonal offers, and grocery tips.
            </p>
            <div className="footer-newsletter">
              <input type="email" placeholder="Enter your email" />
              <button className="btn btn-primary btn-sm btn-block">Subscribe 📬</button>
            </div>
            <div style={{ marginTop: '1.25rem' }}>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>
                DELIVERY HOURS
              </p>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                Mon–Sat: 7 AM – 9 PM<br />
                Sunday: 9 AM – 6 PM
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 FreshCart. All rights reserved. Built with ❤️ for college project.</p>
          <div className="footer-badges">
            <span className="footer-badge">🔒 SSL Secured</span>
            <span className="footer-badge">💳 Secure Payment</span>
            <span className="footer-badge">🚚 Fast Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

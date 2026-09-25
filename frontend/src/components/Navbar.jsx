import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropOpen, setDropOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            🛒 Fresh<span>Cart</span>
          </Link>

          {/* Navigation Links */}
          <div className={`navbar__links ${menuOpen ? "open" : ""}`}>
            <NavLink to="/" className={({isActive}) => `navbar__link ${isActive ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/categories" className={({isActive}) => `navbar__link ${isActive ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Categories</NavLink>
            <NavLink to="/products" className={({isActive}) => `navbar__link ${isActive ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Products</NavLink>
            <NavLink to="/offers" className={({isActive}) => `navbar__link ${isActive ? "active" : ""}`} onClick={() => setMenuOpen(false)}>🔥 Offers</NavLink>
            <NavLink to="/about" className={({isActive}) => `navbar__link ${isActive ? "active" : ""}`} onClick={() => setMenuOpen(false)}>About</NavLink>
            <NavLink to="/contact" className={({isActive}) => `navbar__link ${isActive ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Contact</NavLink>
            {user?.isAdmin && (
              <NavLink to="/admin" className={({isActive}) => `navbar__link ${isActive ? "active" : ""}`} onClick={() => setMenuOpen(false)}>⚙️ Admin</NavLink>
            )}
          </div>

          {/* Right side */}
          <div className="navbar__right">
            {/* Search */}
            <form className="navbar__search" onSubmit={handleSearch}>
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search groceries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search products"
              />
            </form>

            {/* Cart */}
            <button className="cart-btn" onClick={() => navigate("/cart")} aria-label="Shopping cart">
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>}
            </button>

            {/* Auth */}
            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  style={{ background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-full)", padding: "0.45rem 1rem", cursor: "pointer", fontWeight: 600, fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
                >
                  👤 {user.name.split(" ")[0]}
                </button>
                {dropOpen && (
                  <div style={{ position: "absolute", right: 0, top: "110%", background: "#fff", borderRadius: "var(--radius)", boxShadow: "var(--shadow-lg)", border: "1px solid var(--gray-200)", minWidth: 160, zIndex: 999 }}>
                    <Link to="/profile" onClick={() => setDropOpen(false)} style={{ display: "block", padding: "0.75rem 1rem", fontSize: "0.88rem", color: "var(--gray-700)", borderBottom: "1px solid var(--gray-100)" }}>👤 My Profile</Link>
                    <Link to="/orders" onClick={() => setDropOpen(false)} style={{ display: "block", padding: "0.75rem 1rem", fontSize: "0.88rem", color: "var(--gray-700)", borderBottom: "1px solid var(--gray-100)" }}>📦 My Orders</Link>
                    <button onClick={handleLogout} style={{ display: "block", width: "100%", textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.88rem", color: "var(--red)", background: "none", border: "none", cursor: "pointer" }}>🚪 Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
            )}

            {/* Hamburger */}
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const CATEGORIES = [
  'Fruits & Vegetables',
  'Rice, Atta & Grains',
  'Dal & Pulses',
  'Oil & Ghee',
  'Masala & Spices',
  'Dairy, Bread & Eggs',
  'Snacks & Biscuits',
  'Beverages',
  'Instant & Packaged Food',
  'Chocolates & Sweets',
  'Cleaning & Household',
  'Personal Care',
  'Baby Care',
  'Pet Care',
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const isActive = (path) => location.pathname === path;

  const getInitials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">🛒</div>
          Fresh<span>Cart</span>
        </Link>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <span className="navbar-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search groceries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="navbar-search-btn">Search</button>
        </form>

        {/* Links */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>Shop</Link>
          <Link to="/categories" className={`nav-link ${isActive('/categories') ? 'active' : ''}`}>Categories</Link>
          <Link to="/offers" className={`nav-link ${location.pathname === '/offers' ? 'active' : ''}`}>Offers</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>

          {/* Cart */}
          <Link to="/cart" className="nav-cart-btn" style={{ position: 'relative' }}>
            🛍️ Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* User menu */}
          {user ? (
            <div className="nav-user-menu" ref={dropdownRef}>
              <button
                className="nav-user-btn"
                onClick={() => setDropdownOpen((v) => !v)}
              >
                <div className="nav-user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                {user.name.split(' ')[0]}
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>▼</span>
              </button>
              {dropdownOpen && (
                <div className="nav-dropdown">
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                    👤 My Profile
                  </Link>
                  <Link to="/orders" onClick={() => setDropdownOpen(false)}>
                    📦 My Orders
                  </Link>
                  <Link to="/cart" onClick={() => setDropdownOpen(false)}>
                    🛍️ My Cart
                  </Link>
                  <hr />
                  <button
                    className="logout-btn"
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                      navigate('/');
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--navbar-height)',
            left: 0,
            right: 0,
            background: 'white',
            borderTop: '1px solid var(--border)',
            padding: '1rem',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 999,
            animation: 'slideDown 0.15s ease',
          }}
        >
          <form onSubmit={handleSearch} style={{ marginBottom: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type="text"
                placeholder="Search groceries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <Link to="/" className="nav-link" onClick={() => setMobileOpen(false)}>🏠 Home</Link>
            <Link to="/products" className="nav-link" onClick={() => setMobileOpen(false)}>🛒 Shop</Link>
            <Link to="/categories" className="nav-link" onClick={() => setMobileOpen(false)}>📁 Categories</Link>
            <Link to="/offers" className="nav-link" onClick={() => setMobileOpen(false)}>🏷️ Offers</Link>
            <Link to="/contact" className="nav-link" onClick={() => setMobileOpen(false)}>📞 Contact</Link>
            <Link to="/cart" className="nav-link" onClick={() => setMobileOpen(false)}>🛍️ Cart ({cartCount})</Link>
            {user ? (
              <>
                <Link to="/profile" className="nav-link" onClick={() => setMobileOpen(false)}>👤 Profile</Link>
                <Link to="/orders" className="nav-link" onClick={() => setMobileOpen(false)}>📦 Orders</Link>
                <button
                  className="nav-link"
                  style={{ color: 'var(--danger)', textAlign: 'left' }}
                  onClick={() => { logout(); setMobileOpen(false); navigate('/'); }}
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Link to="/login" className="btn btn-outline btn-sm" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

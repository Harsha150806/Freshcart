import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productAPI, reviewAPI, offerAPI } from "../services/api";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import ReviewCard from "../components/ReviewCard";
import OfferCard from "../components/OfferCard";
import LoadingSpinner from "../components/LoadingSpinner";

const CATEGORIES = ["Fruits","Vegetables","Dairy","Bakery","Beverages","Snacks","Rice & Grains","Personal Care","Household"];

const Home = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [offers, setOffers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchCat, setSearchCat] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [fp, bs, off] = await Promise.all([
          productAPI.getFeatured(),
          productAPI.getBestSellers(),
          offerAPI.getAll(),
        ]);
        setFeatured(fp.data);
        setBestSellers(bs.data);
        setOffers(off.data);
        // Fetch some reviews
        if (fp.data.length > 0) {
          const rv = await reviewAPI.getByProduct(fp.data[0]._id);
          setReviews(rv.data.slice(0, 3));
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (searchCat !== "All") params.set("category", searchCat);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container">
          <div className="hero__inner">
            <div>
              <div className="hero__tag">🌿 100% Fresh Guaranteed</div>
              <h1 className="hero__title">
                Fresh Groceries<br />Delivered to <span>Your Door</span>
              </h1>
              <p className="hero__subtitle">
                Shop from thousands of fresh products — fruits, vegetables, dairy, and more.
                Fast delivery in under 2 hours anywhere in the city.
              </p>
              <div className="hero__actions">
                <button className="btn btn-primary btn-lg" onClick={() => navigate("/products")}>🛒 Shop Now</button>
                <button className="btn btn-secondary btn-lg" onClick={() => navigate("/offers")}>🔥 Today's Offers</button>
              </div>
              <div className="hero__stats">
                <div className="hero__stat"><strong>10,000+</strong><span>Happy Customers</span></div>
                <div className="hero__stat"><strong>500+</strong><span>Fresh Products</span></div>
                <div className="hero__stat"><strong>2 Hrs</strong><span>Delivery Time</span></div>
              </div>
            </div>
            <div className="hero__image-wrap">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600" alt="Fresh Groceries" className="hero__image" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Bar ── */}
      <div className="features-bar">
        <div className="container">
          <div className="features-bar__inner">
            {[
              { icon: "⚡", title: "Fast Delivery", sub: "Within 2 hours" },
              { icon: "🌿", title: "Fresh Products", sub: "100% quality assured" },
              { icon: "🔒", title: "Secure Payments", sub: "SSL encrypted checkout" },
              { icon: "↩️", title: "Easy Returns", sub: "Hassle-free returns" },
              { icon: "🎯", title: "Best Prices", sub: "Lowest price guarantee" },
            ].map(f => (
              <div key={f.title} className="feature-item">
                <div className="feature-item__icon">{f.icon}</div>
                <div><div className="feature-item__title">{f.title}</div><div className="feature-item__sub">{f.sub}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <section className="search-section">
        <div className="container">
          <form className="search-bar" onSubmit={handleSearch}>
            <input type="text" placeholder="Search for fruits, vegetables, milk, snacks..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Search products" />
            <select value={searchCat} onChange={e => setSearchCat(e.target.value)} aria-label="Filter by category">
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="submit" aria-label="Search">🔍</button>
          </form>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section" style={{ background: "var(--gray-50)" }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by <span>Category</span></h2>
            <p className="section-subtitle">Browse through our wide range of grocery categories</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(c => <CategoryCard key={c} name={c} />)}
          </div>
        </div>
      </section>

      {/* ── Offer Banners ── */}
      <section className="section">
        <div className="container">
          <div className="offer-banners">
            <div className="offer-banner" style={{ background: "linear-gradient(135deg,#e53935,#ef5350)" }}>
              <div><h3>20% OFF</h3><p>On all Fresh Fruits</p><span className="tag">Shop Now →</span></div>
            </div>
            <div className="offer-banner" style={{ background: "linear-gradient(135deg,#1976d2,#42a5f5)" }}>
              <div><h3>Buy 1 Get 1 Free</h3><p>On selected Dairy Products</p><span className="tag">Grab Deal →</span></div>
            </div>
            <div className="offer-banner" style={{ background: "linear-gradient(135deg,#388e3c,#66bb6a)" }}>
              <div><h3>Free Delivery</h3><p>On orders above ₹499</p><span className="tag">Order Now →</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Popular Products ── */}
      <section className="section" style={{ background: "var(--gray-50)" }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular <span>Products</span></h2>
            <p className="section-subtitle">Freshly curated picks our customers love</p>
          </div>
          {loading ? <LoadingSpinner /> : (
            featured.length > 0 ? (
              <div className="products-grid">
                {featured.slice(0, 8).map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            ) : (
              <div className="empty-state"><div className="empty-state__icon">🥦</div><p className="empty-state__sub">No products yet. Run the seed script to populate.</p></div>
            )
          )}
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate("/products")}>View All Products →</button>
          </div>
        </div>
      </section>

      {/* ── Best Sellers ── */}
      {bestSellers.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">🏆 Best <span>Sellers</span></h2>
              <p className="section-subtitle">Our highest-rated, most-ordered products</p>
            </div>
            <div className="products-grid">
              {bestSellers.slice(0, 8).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Offers ── */}
      {offers.length > 0 && (
        <section className="section" style={{ background: "var(--gray-50)" }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">🔥 Today's <span>Offers</span></h2>
              <p className="section-subtitle">Limited-time deals you don't want to miss</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.25rem" }}>
              {offers.slice(0, 6).map(o => <OfferCard key={o._id} offer={o} />)}
            </div>
            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <button className="btn btn-accent btn-lg" onClick={() => navigate("/offers")}>View All Offers →</button>
            </div>
          </div>
        </section>
      )}

      {/* ── Reviews ── */}
      {reviews.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">What Customers <span>Say</span></h2>
            </div>
            <div className="reviews-grid">
              {reviews.map(r => <ReviewCard key={r._id} review={r} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Why FreshCart ── */}
      <section className="section" style={{ background: "linear-gradient(135deg,var(--primary-dark),var(--primary))", color: "#fff" }}>
        <div className="container text-center">
          <h2 style={{ fontFamily: "Outfit", fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>Why Choose <span style={{ color: "#a5d6a7" }}>FreshCart?</span></h2>
          <p style={{ opacity: 0.85, marginBottom: "2.5rem" }}>We're committed to delivering the best grocery shopping experience</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "2rem" }}>
            {[
              { icon: "⚡", title: "2-Hour Delivery", desc: "From our store to your doorstep in record time" },
              { icon: "🌿", title: "Farm Fresh", desc: "Directly sourced from trusted farms every morning" },
              { icon: "💰", title: "Best Prices", desc: "Unbeatable prices with regular discounts & offers" },
              { icon: "🤝", title: "Trusted Quality", desc: "Every product passes our strict quality checks" },
            ].map(w => (
              <div key={w.title}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{w.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: "0.4rem" }}>{w.title}</h3>
                <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

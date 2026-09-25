import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { productAPI } from "../services/api";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

const CATEGORIES = ["All","Fruits","Vegetables","Dairy","Bakery","Beverages","Snacks","Rice & Grains","Personal Care","Household"];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const limit = 12;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit, sort };
      if (search) params.search = search;
      if (category !== "All") params.category = category;
      const res = await productAPI.getAll(params);
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [category, sort, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleCategoryChange = (cat) => { setCategory(cat); setPage(1); };

  const pages = Math.ceil(total / limit);

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>All Products</h1>
          <p>Fresh groceries at the best prices</p>
          <div className="breadcrumb"><a href="/">Home</a><span>/</span><span>Products</span></div>
        </div>
      </div>

      <div className="section" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div className="container">
          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <input className="form-control" style={{ flex: 1, minWidth: 240 }} type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
            <button type="submit" className="btn btn-primary">🔍 Search</button>
            {search && <button type="button" className="btn btn-ghost" onClick={() => { setSearch(""); setPage(1); fetchProducts(); }}>✕ Clear</button>}
          </form>

          {/* Category chips */}
          <div className="filters-bar">
            <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--gray-600)" }}>Category:</span>
            {CATEGORIES.map(c => (
              <button key={c} className={`filter-chip ${category === c ? "active" : ""}`} onClick={() => handleCategoryChange(c)}>{c}</button>
            ))}
            <select className="filter-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1); }} style={{ marginLeft: "auto" }}>
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Best Rated</option>
            </select>
          </div>

          {/* Results info */}
          <p style={{ color: "var(--gray-500)", fontSize: "0.88rem", marginBottom: "1.25rem" }}>
            Showing {products.length} of {total} products
            {category !== "All" && ` in "${category}"`}
            {search && ` matching "${search}"`}
          </p>

          {loading ? <LoadingSpinner /> : (
            products.length > 0 ? (
              <div className="products-grid">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state__icon">🔍</div>
                <h3 className="empty-state__title">No products found</h3>
                <p className="empty-state__sub">Try different search terms or category</p>
                <button className="btn btn-primary" onClick={() => { setSearch(""); setCategory("All"); setPage(1); }}>Clear Filters</button>
              </div>
            )
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "2rem" }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Prev</button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`btn btn-sm ${p === page ? "btn-primary" : "btn-ghost"}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => p + 1)} disabled={page === pages}>Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;

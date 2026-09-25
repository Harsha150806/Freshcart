import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Email and password are required."); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card fade-in-up">
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🛒</div>
            <h1 className="auth-title">Welcome Back!</h1>
            <p className="auth-subtitle">Login to your FreshCart account</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Demo Credentials */}
          <div className="alert alert-info" style={{ fontSize: "0.82rem" }}>
            <strong>Demo Credentials:</strong><br/>
            Admin: admin@freshcart.com / admin@123<br/>
            User: user@freshcart.com / user@123
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" className="form-control" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
            </div>
            <button type="submit" id="login-submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? "Signing in..." : "Login →"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

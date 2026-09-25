import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    if (!form.phone) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit phone number";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.phone, form.password);
      navigate("/");
    } catch (err) {
      setApiError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card fade-in-up" style={{ maxWidth: 500 }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🌿</div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join FreshCart for fresh groceries delivered fast</p>
          </div>

          {apiError && <div className="alert alert-error">{apiError}</div>}

          <form onSubmit={handleSubmit}>
            {[
              { name: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
              { name: "email", label: "Email Address", type: "email", placeholder: "john@example.com" },
              { name: "phone", label: "Phone Number", type: "tel", placeholder: "10-digit mobile number" },
              { name: "password", label: "Password", type: "password", placeholder: "Min 6 characters" },
              { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat your password" },
            ].map(f => (
              <div key={f.name} className="form-group">
                <label className="form-label" htmlFor={f.name}>{f.label}</label>
                <input id={f.name} name={f.name} type={f.type} className="form-control" placeholder={f.placeholder} value={form[f.name]} onChange={handleChange} />
                {errors[f.name] && <p className="form-error">⚠ {errors[f.name]}</p>}
              </div>
            ))}
            <button type="submit" id="signup-submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name||"", phone: user?.phone||"", password:"", confirmPassword:"" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone || !/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit phone";
    if (form.password && form.password.length < 6) e.password = "Min 6 characters";
    if (form.password && form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = { name: form.name, phone: form.phone };
      if (form.password) payload.password = form.password;
      const r = await authAPI.updateProfile(payload);
      updateUser(r.data);
      setMsg({ type:"success", text:"Profile updated successfully!" });
      setForm(f => ({ ...f, password:"", confirmPassword:"" }));
    } catch (err) {
      setMsg({ type:"error", text: err.response?.data?.message || "Failed to update" });
    } finally { setSaving(false); setTimeout(() => setMsg(null), 3000); }
  };

  return (
    <div>
      <div className="page-hero" style={{ padding:"2rem 0" }}>
        <div className="container"><h1>My Profile</h1><div className="breadcrumb"><a href="/">Home</a><span>/</span><span>Profile</span></div></div>
      </div>
      <section className="section" style={{ paddingTop:"2rem" }}>
        <div className="container">
          <div className="profile-grid">
            {/* Sidebar */}
            <div className="profile-sidebar">
              <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
              <div className="profile-name">{user?.name}</div>
              <div className="profile-email">{user?.email}</div>
              {user?.isAdmin && <span className="badge badge-success" style={{ marginTop:"0.5rem" }}>Admin</span>}
              <ul className="profile-menu" style={{ marginTop:"1.25rem" }}>
                <li><a href="/profile" className="active">👤 My Profile</a></li>
                <li><a href="/orders">📦 My Orders</a></li>
                <li><a href="/address">📍 Addresses</a></li>
                {user?.isAdmin && <li><a href="/admin">⚙️ Admin Panel</a></li>}
                <li><button onClick={() => { logout(); navigate("/"); }} style={{ width:"100%", textAlign:"left", padding:"0.7rem 0.875rem", background:"none", border:"none", cursor:"pointer", fontSize:"0.88rem", color:"var(--red)" }}>🚪 Logout</button></li>
              </ul>
            </div>

            {/* Form */}
            <div className="card" style={{ padding:"2rem" }}>
              <h2 style={{ marginBottom:"1.5rem", fontSize:"1.1rem" }}>Account Information</h2>
              {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
              <form onSubmit={handleSubmit}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-control" value={form.name} onChange={e => setForm({...form,name:e.target.value})} />
                    {errors.name && <p className="form-error">⚠ {errors.name}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email (cannot change)</label>
                    <input className="form-control" value={user?.email} disabled style={{ background:"var(--gray-100)", cursor:"not-allowed" }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-control" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} />
                    {errors.phone && <p className="form-error">⚠ {errors.phone}</p>}
                  </div>
                </div>
                <hr className="divider" />
                <h3 style={{ fontSize:"0.95rem", fontWeight:600, marginBottom:"1rem" }}>Change Password (optional)</h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 1rem" }}>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input className="form-control" type="password" placeholder="Leave blank to keep current" value={form.password} onChange={e => setForm({...form,password:e.target.value})} />
                    {errors.password && <p className="form-error">⚠ {errors.password}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input className="form-control" type="password" value={form.confirmPassword} onChange={e => setForm({...form,confirmPassword:e.target.value})} />
                    {errors.confirmPassword && <p className="form-error">⚠ {errors.confirmPassword}</p>}
                  </div>
                </div>
                <button type="submit" id="save-profile-btn" className="btn btn-primary btn-lg" disabled={saving}>{saving?"Saving...":"Save Changes"}</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;

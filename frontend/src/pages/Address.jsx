import { useState, useEffect } from "react";
import { addressAPI } from "../services/api";

const STATES = ["Andhra Pradesh","Telangana","Tamil Nadu","Karnataka","Kerala","Maharashtra","Delhi","Uttar Pradesh","Rajasthan","Gujarat","West Bengal","Bihar","Madhya Pradesh","Punjab","Haryana","Odisha","Jharkhand","Assam","Other"];

const emptyForm = { fullName:"", mobile:"", house:"", street:"", area:"", city:"", state:"Telangana", pincode:"", landmark:"", isDefault:false };

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchAddresses = async () => {
    try { const r = await addressAPI.getAll(); setAddresses(r.data); } catch {}
  };

  useEffect(() => { fetchAddresses(); }, []);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.mobile || !/^\d{10}$/.test(form.mobile)) e.mobile = "Valid 10-digit mobile is required";
    if (!form.house.trim()) e.house = "House/Flat number is required";
    if (!form.street.trim()) e.street = "Street is required";
    if (!form.area.trim()) e.area = "Area is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state) e.state = "State is required";
    if (!form.pincode || !/^[1-9][0-9]{5}$/.test(form.pincode)) e.pincode = "Valid 6-digit PIN code is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      if (editId) { await addressAPI.update(editId, form); setMsg({ type:"success", text:"Address updated!" }); }
      else { await addressAPI.add(form); setMsg({ type:"success", text:"Address added!" }); }
      await fetchAddresses();
      setShowForm(false); setForm(emptyForm); setEditId(null); setErrors({});
    } catch (err) { setMsg({ type:"error", text: err.response?.data?.message || "Failed to save" }); }
    finally { setSaving(false); setTimeout(() => setMsg(null), 3000); }
  };

  const handleEdit = (addr) => {
    setForm({ fullName:addr.fullName, mobile:addr.mobile, house:addr.house, street:addr.street, area:addr.area, city:addr.city, state:addr.state, pincode:addr.pincode, landmark:addr.landmark||"", isDefault:addr.isDefault });
    setEditId(addr._id); setShowForm(true); setErrors({});
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;
    await addressAPI.delete(id);
    await fetchAddresses();
  };

  return (
    <div>
      <div className="page-hero" style={{ padding:"2rem 0" }}>
        <div className="container"><h1>Delivery Addresses</h1><div className="breadcrumb"><a href="/">Home</a><span>/</span><span>Addresses</span></div></div>
      </div>
      <section className="section" style={{ paddingTop:"2rem" }}>
        <div className="container" style={{ maxWidth:760 }}>
          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
            <h2 style={{ fontSize:"1.1rem" }}>Saved Addresses ({addresses.length})</h2>
            <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}>+ Add New Address</button>
          </div>

          {addresses.map(addr => (
            <div key={addr._id} className="card" style={{ padding:"1.25rem", marginBottom:"1rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontWeight:700, marginBottom:4 }}>{addr.fullName} {addr.isDefault && <span className="badge badge-success" style={{marginLeft:6}}>Default</span>}</div>
                  <div style={{ fontSize:"0.85rem", color:"var(--gray-600)", lineHeight:1.6 }}>
                    {addr.house}, {addr.street}, {addr.area}<br/>{addr.city}, {addr.state} – {addr.pincode}<br/>📞 {addr.mobile}
                    {addr.landmark && <><br/>📍 {addr.landmark}</>}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(addr)}>✏ Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(addr._id)}>🗑 Delete</button>
                </div>
              </div>
            </div>
          ))}

          {addresses.length === 0 && !showForm && (
            <div className="empty-state"><div className="empty-state__icon">📍</div><h3 className="empty-state__title">No addresses saved</h3><p className="empty-state__sub">Add a delivery address to place orders</p></div>
          )}

          {/* Form */}
          {showForm && (
            <div className="card" style={{ padding:"1.75rem", marginTop:"1.5rem" }}>
              <h3 style={{ marginBottom:"1.25rem" }}>{editId ? "Edit Address" : "Add New Address"}</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 1rem" }}>
                  {[{ n:"fullName",l:"Full Name",ph:"John Doe",full:false },{ n:"mobile",l:"Mobile Number",ph:"10-digit",full:false },{ n:"house",l:"House/Flat No.",ph:"Flat 4B, Block C",full:false },{ n:"street",l:"Street",ph:"MG Road",full:false },{ n:"area",l:"Area",ph:"Banjara Hills",full:false },{ n:"city",l:"City",ph:"Hyderabad",full:false }].map(f => (
                    <div key={f.n} className="form-group" style={{ gridColumn: f.full ? "1/-1" : "auto" }}>
                      <label className="form-label">{f.l}</label>
                      <input className="form-control" placeholder={f.ph} value={form[f.n]} onChange={e => setForm({...form,[f.n]:e.target.value})} />
                      {errors[f.n] && <p className="form-error">⚠ {errors[f.n]}</p>}
                    </div>
                  ))}
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <select className="form-control" value={form.state} onChange={e => setForm({...form,state:e.target.value})}>
                      {STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                    {errors.state && <p className="form-error">⚠ {errors.state}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">PIN Code</label>
                    <input className="form-control" placeholder="500001" value={form.pincode} onChange={e => setForm({...form,pincode:e.target.value})} maxLength={6} />
                    {errors.pincode && <p className="form-error">⚠ {errors.pincode}</p>}
                  </div>
                  <div className="form-group" style={{ gridColumn:"1/-1" }}>
                    <label className="form-label">Landmark (optional)</label>
                    <input className="form-control" placeholder="Near City Mall" value={form.landmark} onChange={e => setForm({...form,landmark:e.target.value})} />
                  </div>
                  <div className="form-group" style={{ gridColumn:"1/-1", display:"flex", alignItems:"center", gap:"0.5rem" }}>
                    <input type="checkbox" id="isDefault" checked={form.isDefault} onChange={e => setForm({...form,isDefault:e.target.checked})} />
                    <label htmlFor="isDefault" style={{ fontWeight:500 }}>Set as default address</label>
                  </div>
                </div>
                <div style={{ display:"flex", gap:"0.75rem" }}>
                  <button type="submit" id="save-address-btn" className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Save Address"}</button>
                  <button type="button" className="btn btn-ghost" onClick={() => { setShowForm(false); setEditId(null); setErrors({}); }}>Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Address;

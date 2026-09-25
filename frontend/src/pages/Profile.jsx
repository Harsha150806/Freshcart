import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [newAddress, setNewAddress] = useState({ label: 'Home', street: '', city: '', state: '', pincode: '', isDefault: false });
  const [showAddressForm, setShowAddressForm] = useState(false);

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">🔒</div>
            <h3>Please login to view profile</h3>
            <Link to="/login" className="btn btn-primary btn-lg">Login Now</Link>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (name) => name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', { name: form.name, phone: form.phone, avatar: form.avatar });
      updateUser(data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      await api.put('/auth/profile', { password: passwordForm.newPassword });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error('Please fill all address fields');
      return;
    }
    const updatedAddresses = [...addresses, newAddress];
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', { addresses: updatedAddresses });
      setAddresses(data.addresses);
      updateUser(data);
      setNewAddress({ label: 'Home', street: '', city: '', state: '', pincode: '', isDefault: false });
      setShowAddressForm(false);
      toast.success('Address added!');
    } catch (err) {
      toast.error('Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    try {
      const { data } = await api.put('/auth/profile', { addresses: updated });
      setAddresses(data.addresses);
      updateUser(data);
      toast.success('Address removed');
    } catch (err) {
      toast.error('Failed to remove address');
    }
  };

  const tabs = [
    { id: 'info', label: '👤 Personal Info' },
    { id: 'addresses', label: '📍 Addresses' },
    { id: 'security', label: '🔒 Security' },
  ];

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Profile</h1>
            <div className="breadcrumb">
              <Link to="/">Home</Link> / <span>Profile</span>
            </div>
          </div>
        </div>

        <div className="profile-layout">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-sidebar-header">
              <div className="profile-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <div className="profile-name">{user.name}</div>
              <div className="profile-email">{user.email}</div>
              {user.role === 'admin' && (
                <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 'var(--radius-full)', padding: '0.2rem 0.75rem', fontSize: '0.75rem', marginTop: '0.5rem', display: 'inline-block' }}>
                  👑 Admin
                </span>
              )}
            </div>
            <div className="profile-sidebar-nav">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`profile-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />
              <Link to="/orders" className="profile-nav-item">
                📦 My Orders
              </Link>
              <button
                className="profile-nav-item"
                style={{ width: '100%', color: 'var(--danger)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'var(--font)', fontSize: '0.9rem' }}
                onClick={logout}
              >
                🚪 Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            {activeTab === 'info' && (
              <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '1.5rem' }}>Personal Information</h2>
                <form onSubmit={handleSaveInfo}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Full Name</label>
                      <input
                        className="form-input"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input className="form-input" value={form.email} disabled style={{ background: 'var(--bg)', color: 'var(--text-muted)' }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        className="form-input"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Avatar URL (optional)</label>
                      <input
                        className="form-input"
                        placeholder="https://example.com/avatar.jpg"
                        value={form.avatar}
                        onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? '⏳ Saving...' : '✅ Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontWeight: 700, fontSize: '1.15rem' }}>My Addresses</h2>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowAddressForm(!showAddressForm)}>
                    + Add Address
                  </button>
                </div>

                {showAddressForm && (
                  <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>New Address</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                      <div className="form-group">
                        <label className="form-label">Label</label>
                        <select className="form-select" value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}>
                          <option>Home</option>
                          <option>Office</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Pincode</label>
                        <input className="form-input" placeholder="110001" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                      </div>
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Street</label>
                        <input className="form-input" placeholder="House no., Street, Landmark" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">City</label>
                        <input className="form-input" placeholder="Mumbai" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State</label>
                        <input className="form-input" placeholder="Maharashtra" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button className="btn btn-primary btn-sm" onClick={handleAddAddress} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Address'}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setShowAddressForm(false)}>Cancel</button>
                    </div>
                  </div>
                )}

                {addresses.length === 0 ? (
                  <div className="empty-state" style={{ padding: '2rem' }}>
                    <div className="empty-state-icon">📍</div>
                    <h3>No addresses saved</h3>
                    <p>Add a delivery address to checkout faster.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {addresses.map((addr, i) => (
                      <div key={i} style={{ padding: '1rem 1.25rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            📍 {addr.label}
                            {addr.isDefault && <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.7rem' }}>Default</span>}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {addr.street}, {addr.city}, {addr.state} – {addr.pincode}
                          </div>
                        </div>
                        <button className="btn btn-outline-danger btn-sm" style={{ flexShrink: 0 }} onClick={() => handleDeleteAddress(i)}>
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '1.5rem' }}>Change Password</h2>
                <form onSubmit={handleChangePassword}>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="New password (min 6 chars)"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Repeat new password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? '⏳ Updating...' : '🔒 Update Password'}
                  </button>
                </form>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2rem 0' }} />
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--danger)' }}>Danger Zone</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Once you delete your account, there is no going back.
                  </p>
                  <button className="btn btn-outline-danger">Delete Account</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const FAQS = [
  {
    q: 'What are your delivery hours?',
    a: 'We deliver Monday to Saturday from 7 AM – 9 PM, and Sunday from 9 AM – 6 PM.',
  },
  {
    q: 'Do you offer free delivery?',
    a: 'Yes! Orders above ₹500 qualify for free delivery. A small fee applies to orders below that.',
  },
  {
    q: 'Can I return or exchange products?',
    a: 'We have a 24-hour easy return policy. Contact us within 24 hours of delivery for a hassle-free return.',
  },
  {
    q: 'How fresh are the products?',
    a: 'All products are sourced daily from local farms and suppliers. We guarantee maximum freshness on every order.',
  },
  {
    q: 'Which payment methods do you accept?',
    a: 'We accept UPI, credit/debit cards, net banking, and cash on delivery.',
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    try {
      setLoading(true);
      await api.post('/contact', form);
      toast.success('Message sent! We will get back to you soon. 🎉');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f4c2a 0%, #1a6b3c 50%, #0d7a45 100%)',
          padding: '4rem 1rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute', inset: 0, opacity: 0.07,
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>📞</div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)', margin: '0 0 0.75rem' }}>
            Get in Touch
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.65 }}>
            Have a question, feedback, or need help? We're here for you — always.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          {[
            { icon: '📍', title: 'Our Address', value: '12 FreshMart Lane,\nBengaluru, Karnataka 560001', color: '#22c55e' },
            { icon: '📧', title: 'Email Us', value: 'support@freshcart.in\nbusiness@freshcart.in', color: '#3b82f6' },
            { icon: '📱', title: 'Call Us', value: '+91 98765 43210\n+91 80 1234 5678', color: '#f59e0b' },
            { icon: '🕐', title: 'Working Hours', value: 'Mon–Sat: 7 AM – 9 PM\nSunday: 9 AM – 6 PM', color: '#a855f7' },
          ].map((card) => (
            <div
              key={card.title}
              className="card"
              style={{ padding: '1.75rem', textAlign: 'center', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div
                style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: card.color + '22',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem', margin: '0 auto 1rem',
                  border: `2px solid ${card.color}44`,
                }}
              >
                {card.icon}
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem', color: 'var(--text-primary)' }}>
                {card.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Form + FAQ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          {/* Contact Form */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.35rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              Send Us a Message
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
              Fill out the form and our team will respond within 24 hours.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input
                    id="contact-name"
                    className="form-input"
                    name="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    id="contact-email"
                    className="form-input"
                    type="email"
                    name="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    id="contact-phone"
                    className="form-input"
                    name="phone"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <select
                    id="contact-subject"
                    className="form-input"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="">Select a topic</option>
                    <option value="Order Issue">Order Issue</option>
                    <option value="Delivery Problem">Delivery Problem</option>
                    <option value="Product Quality">Product Quality</option>
                    <option value="Refund / Return">Refund / Return</option>
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Partnership">Partnership</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  id="contact-message"
                  className="form-input"
                  name="message"
                  placeholder="Describe your issue or question in detail..."
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <button
                id="contact-submit"
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                    Sending...
                  </span>
                ) : (
                  '📤 Send Message'
                )}
              </button>
            </form>
          </div>

          {/* FAQ */}
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.35rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Quick answers to common questions.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="card"
                  style={{
                    padding: '0',
                    overflow: 'hidden',
                    border: openFaq === i ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '1rem 1.25rem',
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      gap: '1rem', fontWeight: 600, fontSize: '0.9rem',
                      color: openFaq === i ? 'var(--primary)' : 'var(--text-primary)',
                      transition: 'color 0.2s',
                    }}
                  >
                    <span>{faq.q}</span>
                    <span
                      style={{
                        flexShrink: 0, fontSize: '1.1rem', transition: 'transform 0.2s',
                        transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div
                      style={{
                        padding: '0 1.25rem 1rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.7,
                        borderTop: '1px solid var(--border)',
                        paddingTop: '0.875rem',
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Social links */}
            <div
              className="card"
              style={{ padding: '1.5rem', marginTop: '1.25rem', textAlign: 'center', background: 'linear-gradient(135deg, #0f4c2a, #1a6b3c)' }}
            >
              <p style={{ fontWeight: 700, color: 'white', marginBottom: '0.4rem', fontSize: '1rem' }}>
                Follow Us 🌿
              </p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', marginBottom: '1rem' }}>
                Stay updated with fresh deals & offers
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                {[
                  { label: 'Facebook', icon: '📘' },
                  { label: 'Instagram', icon: '📸' },
                  { label: 'Twitter', icon: '🐦' },
                  { label: 'YouTube', icon: '▶️' },
                ].map((s) => (
                  <button
                    key={s.label}
                    title={s.label}
                    style={{
                      width: 42, height: 42, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      fontSize: '1.2rem', cursor: 'pointer',
                      transition: 'background 0.2s, transform 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.28)';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

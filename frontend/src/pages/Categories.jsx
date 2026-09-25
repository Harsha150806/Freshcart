import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  {
    name: 'Fruits & Vegetables',
    icon: '🥦',
    description: 'Fresh organic fruits and crisp vegetables sourced directly from farms',
    color: '#dcfce7',
    textColor: '#15803d',
  },
  {
    name: 'Dairy & Eggs',
    icon: '🥛',
    description: 'Farm-fresh milk, butter, cheese, yogurt, and free-range eggs',
    color: '#e0f2fe',
    textColor: '#0369a1',
  },
  {
    name: 'Bakery',
    icon: '🍞',
    description: 'Freshly baked breads, buns, croissants, and sweet bakery treats',
    color: '#fef3c7',
    textColor: '#b45309',
  },
  {
    name: 'Beverages',
    icon: '🧃',
    description: 'Fresh fruit juices, cold drinks, teas, coffees, and sparkling sodas',
    color: '#ffedd5',
    textColor: '#c2410c',
  },
  {
    name: 'Snacks',
    icon: '🍿',
    description: 'Crispy chips, nuts, chocolates, cookies, and evening snacks',
    color: '#fce7f3',
    textColor: '#be185d',
  },
  {
    name: 'Household',
    icon: '🏠',
    description: 'Cleaning supplies, laundry detergents, paper towels, and home essentials',
    color: '#ccfbf1',
    textColor: '#0f766e',
  },
  {
    name: 'Personal Care',
    icon: '🧴',
    description: 'Soaps, shampoos, skincare, oral care, and grooming essentials',
    color: '#f3e8ff',
    textColor: '#7e22ce',
  },
  {
    name: 'Meat & Seafood',
    icon: '🥩',
    description: 'Fresh poultry, prime tender cuts of meat, fish, and seafood',
    color: '#fee2e2',
    textColor: '#b91c1c',
  },
];

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ padding: '2.5rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-dark, #1e293b)', marginBottom: '0.5rem' }}>
            Shop by Category
          </h1>
          <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
            Explore our wide range of farm-fresh groceries and household essentials.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid var(--border, #e2e8f0)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 20px -3px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = 'var(--primary, #16a34a)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.borderColor = 'var(--border, #e2e8f0)';
              }}
            >
              <div>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '14px',
                    background: cat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    marginBottom: '1rem',
                  }}
                >
                  {cat.icon}
                </div>
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--text-dark, #1e293b)',
                    marginBottom: '0.4rem',
                  }}
                >
                  {cat.name}
                </h3>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-muted, #64748b)',
                    lineHeight: '1.4',
                    marginBottom: '1rem',
                  }}
                >
                  {cat.description}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-light, #f1f5f9)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: cat.textColor,
                    background: cat.color,
                    padding: '0.25rem 0.6rem',
                    borderRadius: '9999px',
                  }}
                >
                  Explore
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary, #16a34a)' }}>
                  Browse →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;

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
    name: 'Rice, Atta & Grains',
    icon: '🌾',
    description: 'Basmati rice, Sona Masoori, Sharbati Atta, Maida, Suji, and Poha',
    color: '#fef9c3',
    textColor: '#a16207',
  },
  {
    name: 'Dal & Pulses',
    icon: '🫘',
    description: 'Unpolished Toor Dal, Moong Dal, Masoor, Chana Dal, and Rajma',
    color: '#fef3c7',
    textColor: '#b45309',
  },
  {
    name: 'Oil & Ghee',
    icon: '🪔',
    description: 'Pure Cow Ghee, Sunflower Oil, Mustard Oil, Groundnut Oil & Olive Oil',
    color: '#ffedd5',
    textColor: '#c2410c',
  },
  {
    name: 'Masala & Spices',
    icon: '🌶️',
    description: 'Turmeric, Chilli Powder, Garam Masala, Chicken Masala & Biryani Spices',
    color: '#fee2e2',
    textColor: '#b91c1c',
  },
  {
    name: 'Dairy, Bread & Eggs',
    icon: '🥛',
    description: 'Fresh milk, paneer, curd, butter, cheese, eggs & whole wheat bread',
    color: '#e0f2fe',
    textColor: '#0369a1',
  },
  {
    name: 'Snacks & Biscuits',
    icon: '🍪',
    description: 'Parle-G, Good Day, Oreo, Lay\'s chips, Haldiram\'s Bhujia & Dry Fruits',
    color: '#fce7f3',
    textColor: '#be185d',
  },
  {
    name: 'Beverages',
    icon: '🥤',
    description: 'Coca-Cola, Thums Up, Maaza, Real Juices, Tata Tea & Nescafe Coffee',
    color: '#fae8ff',
    textColor: '#86198f',
  },
  {
    name: 'Instant & Packaged Food',
    icon: '🍜',
    description: 'Maggi noodles, Yippee, Pasta, Ketchup, Mayonnaise, Pickles & Oats',
    color: '#ede9fe',
    textColor: '#6d28d9',
  },
  {
    name: 'Chocolates & Sweets',
    icon: '🍫',
    description: 'Dairy Milk Silk, KitKat, 5 Star, Gulab Jamun, Rasgulla & Ice Creams',
    color: '#fdf4ff',
    textColor: '#a21caf',
  },
  {
    name: 'Cleaning & Household',
    icon: '🧹',
    description: 'Surf Excel, Vim liquid, Harpic, Lizol, Garbage bags & Air fresheners',
    color: '#ccfbf1',
    textColor: '#0f766e',
  },
  {
    name: 'Personal Care',
    icon: '🧴',
    description: 'Dettol soaps, Head & Shoulders, Colgate, Himalaya face wash & lotions',
    color: '#f3e8ff',
    textColor: '#7e22ce',
  },
  {
    name: 'Baby Care',
    icon: '👶',
    description: 'Pampers diaper pants, baby wipes, baby shampoo, soap & Cerelac',
    color: '#e0e7ff',
    textColor: '#3730a3',
  },
  {
    name: 'Pet Care',
    icon: '🐾',
    description: 'Pedigree dog food, Whiskas cat food, pet treats & flea shampoo',
    color: '#d1fae5',
    textColor: '#065f46',
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

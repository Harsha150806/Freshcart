import { useNavigate } from "react-router-dom";

const CATEGORY_ICONS = {
  "Fruits": "🍎", "Vegetables": "🥦", "Dairy": "🥛", "Bakery": "🍞",
  "Beverages": "🧃", "Snacks": "🍪", "Rice & Grains": "🌾",
  "Personal Care": "🧴", "Household": "🏠",
};

const CATEGORY_COLORS = {
  "Fruits": "#ffebee", "Vegetables": "#e8f5e9", "Dairy": "#e3f2fd",
  "Bakery": "#fff8e1", "Beverages": "#e0f7fa", "Snacks": "#fce4ec",
  "Rice & Grains": "#f3e5f5", "Personal Care": "#e8eaf6", "Household": "#fff3e0",
};

const CategoryCard = ({ name }) => {
  const navigate = useNavigate();
  return (
    <div
      className="category-card"
      style={{ background: CATEGORY_COLORS[name] || "#f5f5f5" }}
      onClick={() => navigate(`/products?category=${encodeURIComponent(name)}`)}
    >
      <div className="category-card__icon">{CATEGORY_ICONS[name] || "🛒"}</div>
      <div className="category-card__name">{name}</div>
    </div>
  );
};

export default CategoryCard;

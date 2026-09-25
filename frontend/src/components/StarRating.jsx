import { useState } from "react";

/**
 * Interactive star rating component.
 * readonly=true renders a display-only version.
 */
const StarRating = ({ value = 0, onChange, readonly = false, size = "1.25rem" }) => {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className="star-rating" aria-label={`Rating: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${display >= star ? "filled" : "empty"}`}
          style={{ fontSize: size, cursor: readonly ? "default" : "pointer" }}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;

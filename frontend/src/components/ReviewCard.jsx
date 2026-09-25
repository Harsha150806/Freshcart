import StarRating from "./StarRating";

const ReviewCard = ({ review }) => {
  const name = review.userId?.name || "Anonymous";
  const initial = name.charAt(0).toUpperCase();
  const date = new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="card review-card">
      <div className="review-card__header">
        <div className="review-avatar">{initial}</div>
        <div>
          <div className="review-card__name">{name}</div>
          <div className="review-card__date">{date}</div>
        </div>
        <StarRating value={review.rating} readonly size="0.9rem" />
      </div>
      <p className="review-card__text">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;

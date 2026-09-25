const OfferCard = ({ offer }) => {
  const labels = { percentage: `${offer.discountValue}% OFF`, flat: `₹${offer.discountValue} OFF`, bogo: "Buy 1 Get 1", free_delivery: "Free Delivery" };

  return (
    <div className="offer-card" style={{ background: `linear-gradient(135deg, ${offer.bgColor}, ${offer.bgColor}cc)` }}>
      <div className="offer-card__body">
        <div className="offer-card__label">🔥 Limited Offer</div>
        <div className="offer-card__title">{offer.title}</div>
        <div className="offer-card__desc">{offer.description}</div>
        {offer.couponCode && (
          <div className="offer-card__code">Use Code: {offer.couponCode}</div>
        )}
        {!offer.couponCode && (
          <div className="offer-card__code">{labels[offer.discountType] || "Special Deal"}</div>
        )}
      </div>
    </div>
  );
};

export default OfferCard;

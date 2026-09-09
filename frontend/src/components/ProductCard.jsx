import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/product.css';

const ProductCard = ({ product }) => {
  // Realistic e-commerce calculations (MRP based on admin-defined product.discount)
  const discountPercent = product.discount && product.discount > 0 ? product.discount : 0;
  const originalPrice = discountPercent > 0 
    ? Math.round(product.price / (1 - discountPercent / 100)) 
    : product.price;
  const hasReviews = product.numReviews && product.numReviews > 0;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/product/${product._id}`}>
          <img src={product.imageUrl} alt={product.name} className="product-image" />
        </Link>
      </div>

      <div className="product-info">
        <span className="card-category">{product.category || 'General'}</span>

        <h3 title={product.name} className="card-title">
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>

        {/* Rating Badge */}
        <div className="card-rating-row">
          {hasReviews ? (
            <>
              <span className="rating-pill">
                ★ {product.ratings.toFixed(1)}
              </span>
              <span className="rating-count">({product.numReviews})</span>
            </>
          ) : (
            <>
              <span className="rating-pill rating-pill-new">
                ★ New
              </span>
              <span className="rating-count">(No reviews yet)</span>
            </>
          )}
        </div>

        {/* Price Row: Discounted Price + Original Strike-through + % Off */}
        <div className="card-price-row">
          <span className="price">₹{product.price.toLocaleString()}</span>
          {discountPercent > 0 && (
            <>
              <span className="original-price">₹{originalPrice.toLocaleString()}</span>
              <span className="discount-tag">{discountPercent}% off</span>
            </>
          )}
        </div>

        {/* Delivery / Guarantee Tag */}
        <div className="card-perks">
          <span className="perk-tag">🚚 Free Delivery</span>
        </div>

        <Link to={`/product/${product._id}`} className="btn card-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;

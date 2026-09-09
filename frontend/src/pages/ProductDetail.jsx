import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import { addToCart } from '../redux/cartSlice';
import '../styles/product.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/products/${id}/reviews`);
      const data = await res.json();
      if (res.ok) {
        setReviews(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      dispatch(addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        qty: Number(qty)
      }));
      alert(`Successfully added ${qty} item(s) to your cart!`);
    }
  };

  const handleBuyNow = () => {
    if (product && product.stock > 0) {
      dispatch(addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        qty: Number(qty)
      }));
      navigate('/checkout');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setReviewLoading(true);
      setReviewMessage('');

      const res = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      const data = await res.json();
      if (res.ok) {
        setReviewMessage('✅ Thank you! Your review was submitted successfully.');
        setComment('');
        fetchReviews();

        // Refresh product to update average rating and review count
        const prodRes = await fetch(`/api/products/${id}`);
        const prodData = await prodRes.json();
        setProduct(prodData);
      } else {
        setReviewMessage(`❌ ${data.message || 'Failed to submit review'}`);
      }
    } catch (err) {
      setReviewMessage(`❌ ${err.message || 'Error submitting review'}`);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', margin: '100px', color: '#f97316' }}>Loading Product...</div>;
  if (!product) return <div style={{ textAlign: 'center', margin: '100px', color: '#ef4444' }}>Product Not Found</div>;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="product-detail-wrapper" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* Breadcrumb Navigation */}
      <div style={{ color: '#a1a1aa', marginBottom: '20px', fontSize: '0.95rem' }}>
        <Link to="/" style={{ color: '#f97316' }}>Home</Link> / <Link to="/shop" style={{ color: '#f97316' }}>Shop</Link> / {product.category} / <span style={{ color: '#fff' }}>{product.name}</span>
      </div>

      <div className="product-detail">
        {/* Left Side: Image */}
        <div className="detail-image-container">
          <img src={product.imageUrl} alt={product.name} className="detail-image" />
        </div>

        {/* Right Side: Information Block */}
        <div className="detail-info">
          
          <h2 style={{ fontSize: '2.8rem', marginBottom: '5px' }}>{product.name}</h2>

          {/* Ratings Overview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ color: '#f59e0b', fontSize: '1.2rem' }}>★</span>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>
              {product.ratings ? product.ratings.toFixed(1) : 'New'}
            </span>
            <span style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
              ({product.numReviews || 0} customer {product.numReviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px', margin: '15px 0', flexWrap: 'wrap' }}>
            <span className="detail-price" style={{ fontSize: '2.5rem', margin: 0 }}>
              ₹{product.price.toLocaleString()}
            </span>
            {product.discount > 0 && (
              <>
                <span style={{ fontSize: '1.4rem', color: '#71717a', textDecoration: 'line-through' }}>
                  ₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
                </span>
                <span style={{ fontSize: '1.15rem', color: '#10b981', fontWeight: 'bold', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '6px' }}>
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ color: '#fff', marginBottom: '10px' }}>Product Description</h4>
            <p style={{ color: '#a1a1aa', lineHeight: '1.8' }}>{product.description}</p>
          </div>

          {/* Quantity and Cart Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '10px' }}>
            {!isOutOfStock && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label style={{ color: '#fff', fontWeight: '500' }}>Quantity:</label>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  style={{
                    padding: '8px 16px',
                    background: '#18181b',
                    color: '#fff',
                    border: '1px solid #3f3f46',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {[...Array(Math.min(product.stock, 10)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="btn"
                style={{
                  flex: '1 1 180px',
                  padding: '16px',
                  fontSize: '1.05rem',
                  background: isOutOfStock ? '#3f3f46' : '#27272a',
                  color: '#fff',
                  border: '1px solid #3f3f46',
                  opacity: isOutOfStock ? 0.5 : 1,
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                }}
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="btn"
                style={{
                  flex: '1 1 180px',
                  padding: '16px',
                  fontSize: '1.05rem',
                  background: isOutOfStock ? '#3f3f46' : '#f97316',
                  color: '#fff',
                  opacity: isOutOfStock ? 0.5 : 1,
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                }}
              >
                ⚡ Buy Now
              </button>
            </div>
          </div>
          
          <p style={{ marginTop: '15px', color: !isOutOfStock ? '#10b981' : '#ef4444', fontWeight: '600' }}>
            {!isOutOfStock ? `● In Stock (${product.stock} units available)` : `● Temporarily Out of Stock`}
          </p>

        </div>
      </div>

      {/* Customer Reviews Section */}
      <div style={{ marginTop: '60px', borderTop: '1px solid #27272a', paddingTop: '40px' }}>
        <h3 style={{ color: '#f97316', fontSize: '1.8rem', marginBottom: '25px' }}>Customer Reviews</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          
          {/* Left: Reviews List */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '15px' }}>Reviews ({reviews.length})</h4>
            {reviews.length === 0 ? (
              <p style={{ color: '#a1a1aa' }}>No reviews yet. Be the first to share your thoughts on this product!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {reviews.map((rev) => (
                  <div key={rev._id} style={{ background: '#18181b', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong style={{ color: '#fff' }}>{rev.name}</strong>
                      <span style={{ color: '#f59e0b' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                    </div>
                    <small style={{ color: '#a1a1aa', display: 'block', marginBottom: '8px' }}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </small>
                    <p style={{ margin: 0, color: '#d4d4d8', lineHeight: '1.5' }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Write a Review Form */}
          <div style={{ background: '#18181b', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', height: 'fit-content' }}>
            <h4 style={{ color: '#fff', marginBottom: '15px' }}>Write a Customer Review</h4>

            {reviewMessage && (
              <div style={{ padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', background: '#27272a', color: '#fff', fontSize: '0.9rem' }}>
                {reviewMessage}
              </div>
            )}

            {user ? (
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '6px', fontSize: '0.9rem' }}>Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#09090b',
                      color: '#fff',
                      border: '1px solid #27272a',
                      borderRadius: '6px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="5">★★★★★ (5 - Excellent)</option>
                    <option value="4">★★★★☆ (4 - Very Good)</option>
                    <option value="3">★★★☆☆ (3 - Good)</option>
                    <option value="2">★★☆☆☆ (2 - Fair)</option>
                    <option value="1">★☆☆☆☆ (1 - Poor)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '6px', fontSize: '0.9rem' }}>Review Comment</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Write your honest review here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#09090b',
                      color: '#fff',
                      border: '1px solid #27272a',
                      borderRadius: '6px',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button type="submit" disabled={reviewLoading} className="btn" style={{ padding: '12px' }}>
                  {reviewLoading ? 'Submitting Review...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <p style={{ color: '#a1a1aa', margin: 0 }}>
                Please <Link to="/login" style={{ color: '#f97316', fontWeight: 'bold' }}>Log In</Link> to write a review for this product.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;


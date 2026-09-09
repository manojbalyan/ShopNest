import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' or 'cod'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (cartItems.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '30px', background: '#18181b', borderRadius: '12px', color: '#fff', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ marginBottom: '15px' }}>Your Cart is Empty</h2>
        <p style={{ color: '#a1a1aa', marginBottom: '25px' }}>Add items to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="btn">Browse Products</Link>
      </div>
    );
  }

  // Handle Cash on Delivery
  const handleCodOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          items: cartItems,
          totalAmount: totalPrice,
          address,
          paymentId: `COD_${Date.now()}`
        })
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(clearCart());
        navigate('/ordersuccess');
      } else {
        setErrorMessage(data.message || 'Failed to place Cash on Delivery order');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error processing COD order');
    } finally {
      setLoading(false);
    }
  };

  // Handle Razorpay Online Payment
  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      // 1. Fetch Razorpay Public Key from backend
      const keyRes = await fetch('/api/payment/key', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const keyData = await keyRes.json();
      if (!keyRes.ok) {
        throw new Error(keyData.message || 'Failed to get Razorpay public key');
      }

      // 2. Create order on backend via Razorpay SDK
      const orderRes = await fetch('/api/payment/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ amount: totalPrice })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.message || 'Failed to initialize Razorpay payment');
      }

      // 3. Configure and open the Razorpay Checkout Modal
      const options = {
        key: keyData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ShopNest',
        description: 'Order Payment (Test Sandbox)',
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // 4. Verify payment signature on backend
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
              },
              body: JSON.stringify(response)
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              alert('Payment signature verification failed. Please contact support.');
              return;
            }

            // 5. Save the verified order in MongoDB
            const saveOrderRes = await fetch('/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
              },
              body: JSON.stringify({
                items: cartItems,
                totalAmount: totalPrice,
                address,
                paymentId: response.razorpay_payment_id
              })
            });

            if (saveOrderRes.ok) {
              dispatch(clearCart());
              navigate('/ordersuccess');
            } else {
              const saveError = await saveOrderRes.json();
              alert(saveError.message || 'Error recording order after payment');
            }
          } catch (err) {
            console.error('Payment callback error:', err);
            alert('An error occurred while confirming your payment.');
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: '9999999999'
        },
        theme: {
          color: '#f97316'
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Payment initiation failed');
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (paymentMethod === 'cod') {
      handleCodOrder();
    } else {
      handleRazorpayPayment();
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout & Delivery</h2>

      {errorMessage && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px' }}>
          {errorMessage}
        </div>
      )}

      {/* Test Sandbox Information Box */}
      <div style={{ background: '#1c1917', border: '1px solid #f97316', padding: '16px', borderRadius: '10px', marginBottom: '25px' }}>
        <p style={{ color: '#f97316', fontWeight: 'bold', margin: '0 0 6px 0' }}>
          🛡️ Razorpay Test Sandbox Active (Zero Real Money Transferred)
        </p>
        <p style={{ color: '#d6d3d1', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
          You can test the checkout with real Razorpay UI! In the popup, choose <strong>UPI</strong> and enter <code>success@razorpay</code>, or choose <strong>Card</strong> and enter standard test cards with any CVV and future expiry date.
        </p>
      </div>

      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>1. Shipping Address</h3>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Street Address"
            required
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input
              type="text"
              placeholder="City"
              required
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
            <input
              type="text"
              placeholder="Postal Code"
              required
              value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
            />
          </div>
          <input
            type="text"
            placeholder="Country"
            required
            value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
          />

          <h3 style={{ marginTop: '25px' }}>2. Payment Method</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '8px',
              background: paymentMethod === 'razorpay' ? 'rgba(249, 115, 22, 0.1)' : '#18181b',
              border: paymentMethod === 'razorpay' ? '1px solid #f97316' : '1px solid #27272a',
              cursor: 'pointer'
            }}>
              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={paymentMethod === 'razorpay'}
                onChange={() => setPaymentMethod('razorpay')}
              />
              <div>
                <strong>Razorpay Online Payment</strong>
                <p style={{ margin: '3px 0 0', fontSize: '0.85rem', color: '#a1a1aa' }}>
                  UPI, Cards (Visa, Mastercard, RuPay), NetBanking, Wallets
                </p>
              </div>
            </label>

            <label style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '8px',
              background: paymentMethod === 'cod' ? 'rgba(249, 115, 22, 0.1)' : '#18181b',
              border: paymentMethod === 'cod' ? '1px solid #f97316' : '1px solid #27272a',
              cursor: 'pointer'
            }}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
              />
              <div>
                <strong>Cash on Delivery (COD)</strong>
                <p style={{ margin: '3px 0 0', fontSize: '0.85rem', color: '#a1a1aa' }}>
                  Pay with cash upon package delivery
                </p>
              </div>
            </label>
          </div>

          <div className="checkout-summary">
            <h4>Total Amount: ₹{totalPrice.toFixed(2)}</h4>
            <button type="submit" className="btn" disabled={loading} style={{ width: '100%', padding: '14px' }}>
              {loading ? 'Processing...' : paymentMethod === 'razorpay' ? 'Proceed to Razorpay' : 'Place Order (COD)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;


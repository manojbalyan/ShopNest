import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchMyOrders = async () => {
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(Array.isArray(data) ? data : []);
        } else {
          if (res.status === 401) {
             logout();
             navigate('/login');
          }
          setOrders([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDetails = (orderId) => {
    setExpandedOrderId(prev => prev === orderId ? null : orderId);
  };

  const containerStyle = { maxWidth: '1000px', margin: '40px auto', padding: '30px', background: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: '#fafafa' };
  const badgeStyle = { background: 'rgba(249,115,22,0.1)', color: '#f97316', padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold', display: 'inline-block' };

  if (!user) return null;

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '30px', marginBottom: '30px' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '2.2rem', marginBottom: '10px' }}>My Profile</h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.2rem', marginBottom: '5px' }}><strong>Name:</strong> {user.name}</p>
          <p style={{ color: '#a1a1aa', fontSize: '1.2rem', marginBottom: '15px' }}><strong>Email:</strong> {user.email}</p>
          <span style={badgeStyle}>Account Type: {user.role.toUpperCase()}</span>
        </div>
        <button onClick={handleLogout} className="btn" style={{ background: '#ef4444', boxShadow: 'none' }}>Logout</button>
      </div>

      <h3 style={{ color: '#f97316', marginBottom: '20px', fontSize: '1.5rem' }}>Order History</h3>
      {loading ? (
        <p style={{ color: '#a1a1aa' }}>Fetching your orders...</p>
      ) : orders.length === 0 ? (
        <div style={{ background: '#09090b', padding: '30px', borderRadius: '8px', textAlign: 'center', border: '1px solid #27272a' }}>
          <p style={{ color: '#a1a1aa', marginBottom: '15px' }}>You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {orders.map(order => {
            const isExpanded = expandedOrderId === order._id;
            const currentStep = order.status === 'Delivered' ? 2 : order.status === 'Shipped' ? 1 : 0;
            const isCancelled = order.status === 'Cancelled';
            return (
              <div key={order._id} style={{ background: '#09090b', padding: '20px', borderRadius: '12px', border: '1px solid #27272a' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                  <div>
                    <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '5px' }}>Order ID: <span style={{ color: '#fff' }}>{order._id}</span></p>
                    <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '5px' }}>Placed On: <span style={{ color: '#fff' }}>{new Date(order.createdAt).toLocaleDateString()}</span></p>
                    <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Total: <strong style={{ color: '#10b981' }}>₹{order.totalAmount.toFixed(2)}</strong></p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ 
                      background: order.status === 'Delivered' ? 'rgba(16,185,129,0.1)' : order.status === 'Shipped' ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)', 
                      color: order.status === 'Delivered' ? '#10b981' : order.status === 'Shipped' ? '#3b82f6' : '#f59e0b',
                      padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' 
                    }}>
                      {order.status}
                    </span>
                    <button
                      onClick={() => toggleDetails(order._id)}
                      style={{
                        background: '#27272a',
                        color: '#fff',
                        border: '1px solid #3f3f46',
                        padding: '8px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      {isExpanded ? 'Hide Details' : 'View Items'}
                    </button>
                  </div>
                </div>

                {/* Visual Order Progress Stepper */}
                {!isCancelled ? (
                  <div style={{ background: '#121215', padding: '16px 20px', borderRadius: '8px', margin: '20px 0 10px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                      
                      {/* Step 1: Placed */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: currentStep >= 0 ? '#10b981' : '#27272a',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          marginBottom: '6px'
                        }}>✓</div>
                        <span style={{ fontSize: '0.8rem', color: currentStep >= 0 ? '#fff' : '#71717a', fontWeight: '500' }}>Placed</span>
                      </div>

                      {/* Line 1 */}
                      <div style={{
                        flex: 1,
                        height: '3px',
                        background: currentStep >= 1 ? '#10b981' : '#27272a',
                        margin: '0 8px',
                        marginBottom: '20px',
                        transition: 'background 0.3s ease'
                      }} />

                      {/* Step 2: Shipped */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: currentStep >= 1 ? '#10b981' : '#27272a',
                          color: currentStep >= 1 ? '#fff' : '#71717a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          marginBottom: '6px'
                        }}>{currentStep >= 1 ? '✓' : '2'}</div>
                        <span style={{ fontSize: '0.8rem', color: currentStep >= 1 ? '#fff' : '#71717a', fontWeight: '500' }}>Shipped</span>
                      </div>

                      {/* Line 2 */}
                      <div style={{
                        flex: 1,
                        height: '3px',
                        background: currentStep >= 2 ? '#10b981' : '#27272a',
                        margin: '0 8px',
                        marginBottom: '20px',
                        transition: 'background 0.3s ease'
                      }} />

                      {/* Step 3: Delivered */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: currentStep >= 2 ? '#10b981' : '#27272a',
                          color: currentStep >= 2 ? '#fff' : '#71717a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          marginBottom: '6px'
                        }}>{currentStep >= 2 ? '✓' : '3'}</div>
                        <span style={{ fontSize: '0.8rem', color: currentStep >= 2 ? '#fff' : '#71717a', fontWeight: '500' }}>Delivered</span>
                      </div>

                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '10px 16px', borderRadius: '8px', margin: '15px 0', fontSize: '0.9rem', fontWeight: '500' }}>
                    ❌ This order was cancelled.
                  </div>
                )}

                {/* Expandable Order Details Card */}
                {isExpanded && (
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #27272a' }}>
                    <h4 style={{ color: '#f97316', marginBottom: '12px' }}>Items Purchased</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      {order.items && order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#18181b', padding: '10px 15px', borderRadius: '8px' }}>
                          {item.productId?.imageUrl && (
                            <img src={item.productId.imageUrl} alt={item.productId?.name || 'Product'} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />
                          )}
                          <div style={{ flexGrow: 1 }}>
                            <p style={{ margin: '0 0 4px', color: '#fff', fontWeight: '500' }}>{item.productId?.name || 'Product Item'}</p>
                            <p style={{ margin: 0, color: '#a1a1aa', fontSize: '0.85rem' }}>Qty: {item.qty} × ₹{item.price}</p>
                          </div>
                          <div style={{ color: '#10b981', fontWeight: 'bold' }}>
                            ₹{(item.qty * item.price).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', background: '#18181b', padding: '15px', borderRadius: '8px' }}>
                      <div>
                        <strong style={{ color: '#a1a1aa', fontSize: '0.85rem', display: 'block', marginBottom: '5px' }}>SHIPPING ADDRESS</strong>
                        <p style={{ margin: 0, color: '#fff', fontSize: '0.9rem', lineHeight: '1.4' }}>
                          {order.address?.fullName}<br />
                          {order.address?.street}, {order.address?.city}<br />
                          {order.address?.postalCode}, {order.address?.country}
                        </p>
                      </div>
                      <div>
                        <strong style={{ color: '#a1a1aa', fontSize: '0.85rem', display: 'block', marginBottom: '5px' }}>PAYMENT REFERENCE</strong>
                        <p style={{ margin: 0, color: '#fff', fontSize: '0.9rem', wordBreak: 'break-all' }}>
                          {order.paymentId || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Profile;

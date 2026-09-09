import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    };
    fetchOrders();
  }, [user]);

  const updateStatus = async (id, status) => {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setOrders(orders.map(order => order._id === id ? { ...order, status } : order));
    }
  };

  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#f97316', marginBottom: '20px' }}>Manage Orders</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr style={rowStyle}>
              <th style={thStyle}>ORDER ID</th>
              <th style={thStyle}>USER</th>
              <th style={thStyle}>TOTAL</th>
              <th style={thStyle}>DATE</th>
              <th style={thStyle}>STATUS</th>
              <th style={thStyle}>DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} style={rowStyle}>
                <td style={tdStyle}>{order._id.substring(0, 8)}...</td>
                <td style={tdStyle}>{order.userId?.name || 'Deleted User'}</td>
                <td style={tdStyle}>₹{order.totalAmount.toFixed(2)}</td>
                <td style={tdStyle}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  <select 
                    value={order.status} 
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    style={{ background: '#09090b', color: '#fff', padding: '6px', border: '1px solid #27272a', borderRadius: '4px', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    style={{
                      background: '#27272a',
                      color: '#f97316',
                      border: '1px solid #f97316',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    View Items
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Admin Order Details Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: '#18181b', border: '1px solid #27272a', borderRadius: '12px',
            maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '25px', color: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#f97316', margin: 0 }}>Order #{selectedOrder._id}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'transparent', border: 'none', color: '#a1a1aa', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: '#a1a1aa', marginBottom: '5px' }}>
              <strong>Customer:</strong> {selectedOrder.userId?.name} ({selectedOrder.userId?.email || 'N/A'})
            </p>
            <p style={{ color: '#a1a1aa', marginBottom: '15px' }}>
              <strong>Payment Reference:</strong> {selectedOrder.paymentId || 'N/A'}
            </p>

            <h4 style={{ color: '#f97316', marginBottom: '10px' }}>Purchased Items</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#09090b', padding: '10px', borderRadius: '6px' }}>
                  {item.productId?.imageUrl && (
                    <img src={item.productId.imageUrl} alt={item.productId?.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  )}
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontWeight: '500' }}>{item.productId?.name || 'Product'}</div>
                    <small style={{ color: '#a1a1aa' }}>Qty: {item.qty} × ₹{item.price}</small>
                  </div>
                  <strong style={{ color: '#10b981' }}>₹{(item.qty * item.price).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div style={{ background: '#09090b', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
              <strong style={{ color: '#a1a1aa', display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>DELIVERY ADDRESS</strong>
              <p style={{ margin: 0, lineHeight: '1.4', fontSize: '0.95rem' }}>
                {selectedOrder.address?.fullName}<br />
                {selectedOrder.address?.street}, {selectedOrder.address?.city}<br />
                {selectedOrder.address?.postalCode}, {selectedOrder.address?.country}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0 }}>Total Amount: <span style={{ color: '#10b981' }}>₹{selectedOrder.totalAmount.toFixed(2)}</span></h4>
              <button onClick={() => setSelectedOrder(null)} className="btn" style={{ padding: '8px 16px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const containerStyle = { maxWidth: '1200px', margin: '40px auto', padding: '30px', background: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: '#fafafa' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const rowStyle = { borderBottom: '1px solid rgba(255,255,255,0.1)' };
const thStyle = { padding: '15px', textAlign: 'left', color: '#a1a1aa', fontSize: '0.9rem' };
const tdStyle = { padding: '15px', textAlign: 'left' };

export default AdminOrders;

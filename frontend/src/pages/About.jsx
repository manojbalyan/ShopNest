import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 24px',
    background: '#18181b',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    textAlign: 'center'
  };

  const featureCardStyle = {
    background: '#27272a',
    padding: '24px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    textAlign: 'left',
    flex: '1 1 calc(50% - 20px)',
    minWidth: '260px'
  };

  return (
    <div style={containerStyle}>
      <img
        src="/ShopNestLogo.png"
        alt="ShopNest Logo"
        style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '16px' }}
      />
      <h2 style={{ fontSize: '2.5rem', marginBottom: '8px', color: '#fff', fontWeight: '700' }}>
        About ShopNest
      </h2>
      <p style={{ color: '#f97316', fontSize: '1.1rem', fontWeight: '500', marginBottom: '24px' }}>
        Your Modern Destination for Curated Quality &amp; Seamless Shopping
      </p>

      <p style={{ color: '#a1a1aa', fontSize: '1.05rem', lineHeight: '1.8', maxWidth: '720px', margin: '0 auto 36px auto' }}>
        Welcome to <strong>ShopNest</strong> — an e-commerce platform built to make online shopping smooth, dependable, and enjoyable.
        From lifestyle essentials to curated goods, we bring together carefully selected products, transparent pricing, and lightning-fast checkout.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginBottom: '40px' }}>
        <div style={featureCardStyle}>
          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>✨</div>
          <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '6px' }}>Curated Collection</h4>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
            Every product is handpicked to ensure high quality, reliability, and value for your everyday needs.
          </p>
        </div>

        <div style={featureCardStyle}>
          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>⚡</div>
          <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '6px' }}>Fast &amp; Reliable</h4>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
            Swift order processing and seamless tracking so your favorite items reach your doorstep on time.
          </p>
        </div>

        <div style={featureCardStyle}>
          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🔒</div>
          <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '6px' }}>Secure Payments</h4>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
            Industry-standard encryption and trusted payment gateways ensure your transactions are always safe.
          </p>
        </div>

        <div style={featureCardStyle}>
          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>💬</div>
          <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '6px' }}>Customer First</h4>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
            Dedicated support team ready to assist you with inquiries, orders, and after-sales satisfaction.
          </p>
        </div>
      </div>

      <div style={{
        padding: '24px',
        background: 'rgba(249, 115, 22, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(249, 115, 22, 0.15)',
        marginBottom: '32px'
      }}>
        <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '6px' }}>Built with Care</h4>
        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>
          ShopNest is founded and maintained by <strong>Manoj Balyan</strong>, focusing on delivering clean design, rock-solid engineering, and a delightful shopping journey.
        </p>
      </div>

      <Link
        to="/shop"
        style={{
          display: 'inline-block',
          padding: '12px 32px',
          background: '#f97316',
          color: '#fff',
          fontWeight: '600',
          borderRadius: '8px',
          textDecoration: 'none',
          transition: 'background 0.2s ease',
          fontSize: '1rem'
        }}
      >
        Explore Products →
      </Link>
    </div>
  );
};

export default About;

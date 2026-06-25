import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
    <div style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--border-subtle)', fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: '1rem' }}>404</div>
    <h2 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Page not found</h2>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>The page you're looking for doesn't exist or has been moved.</p>
    <Link to='/' style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9375rem' }}>
      <Icon name='arrow left' /> Back to Home
    </Link>
  </div>
);

export default NotFound;

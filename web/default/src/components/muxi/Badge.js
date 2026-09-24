import React from 'react';

const VARIANTS = {
  default: '',
  success: 'muxi-badge--success',
  warning: 'muxi-badge--warning',
  danger: 'muxi-badge--danger',
  accent: 'muxi-badge--accent',
};

const Badge = ({ children, variant = 'default', pulse = false, className = '' }) => {
  const classes = [
    'muxi-badge',
    VARIANTS[variant] || '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {pulse && <span className='muxi-badge-dot' aria-hidden='true' />}
      {children}
    </span>
  );
};

export default Badge;

import React from 'react';

const VARIANTS = {
  primary: 'muxi-btn--primary',
  secondary: 'muxi-btn--secondary',
  ghost: 'muxi-btn--ghost',
  danger: 'muxi-btn--danger',
  accent: 'muxi-btn--accent',
};

const SIZES = {
  sm: 'muxi-btn--sm',
  md: '',
  lg: 'muxi-btn--lg',
};

const Button = React.forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    loading = false,
    disabled = false,
    block = false,
    className = '',
    ...rest
  },
  ref
) {
  const classes = [
    'muxi-btn',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || '',
    block ? 'muxi-btn--block' : '',
    loading ? 'muxi-btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;

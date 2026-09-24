import React from 'react';

const MetricCard = ({
  label,
  value,
  sublabel,
  variant,
  size,
  highlight = false,
  children,
  className = '',
}) => {
  const classes = [
    'muxi-metric-card',
    size && `muxi-metric-card--${size}`,
    variant && `muxi-metric-card--${variant}`,
    highlight && 'muxi-metric-card--highlight',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const isPrimitiveValue =
    value == null || typeof value === 'string' || typeof value === 'number';

  return (
    <div className={classes}>
      <div className='muxi-metric-card-head'>
        {label && <span className='muxi-metric-label'>{label}</span>}
        {sublabel && <span className='muxi-metric-sublabel'>{sublabel}</span>}
      </div>
      {value != null && value !== '' && (
        isPrimitiveValue ? (
          <div className='muxi-metric-value muxi-tabular-nums'>{value}</div>
        ) : (
          <div className='muxi-metric-value-slot'>{value}</div>
        )
      )}
      {children && <div className='muxi-metric-card-body'>{children}</div>}
    </div>
  );
};

export default MetricCard;

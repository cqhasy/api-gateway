import React from 'react';

const BrandMark = ({ size = 28, className = '' }) => {
  const gradId = React.useId().replace(/:/g, '');

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 32 32'
      width={size}
      height={size}
      className={`muxi-brand-mark ${className}`.trim()}
      aria-hidden='true'
    >
      <defs>
        <linearGradient id={gradId} x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#FCD34D' />
          <stop offset='100%' stopColor='#F2B90C' />
        </linearGradient>
      </defs>
      <circle cx='16' cy='8' r='7' fill={`url(#${gradId})`} />
      <circle cx='24' cy='16' r='7' fill={`url(#${gradId})`} />
      <circle cx='16' cy='24' r='7' fill={`url(#${gradId})`} />
      <circle cx='8' cy='16' r='7' fill={`url(#${gradId})`} />
    </svg>
  );
};

export default BrandMark;

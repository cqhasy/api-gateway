import React from 'react';
import BrandMark from './BrandMark';

const BrandLockup = ({ suffix = 'API', className = '', markSize = 26 }) => {
  return (
    <span className={`muxi-brand-lockup ${className}`.trim()}>
      <BrandMark size={markSize} />
      <span className='muxi-brand-lockup-text'>
        <span className='muxi-brand-word'>MUXI</span>
        {suffix && <span className='muxi-brand-suffix'>{suffix}</span>}
      </span>
    </span>
  );
};

export default BrandLockup;

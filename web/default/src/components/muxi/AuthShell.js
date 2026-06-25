import React from 'react';
import BrandLockup from './BrandLockup';

const AuthShell = ({
  title,
  subtitle,
  brandDescription,
  children,
  footer,
}) => {
  return (
    <div className='muxi-auth-page'>
      <div className='muxi-auth-shell muxi-auth-shell--centered'>
        <header className='muxi-auth-header'>
          <BrandLockup markSize={32} className='muxi-auth-brand-lockup muxi-auth-brand-lockup--centered' />
          {brandDescription && (
            <p className='muxi-auth-brand-tagline'>{brandDescription}</p>
          )}
        </header>

        <div className='muxi-auth-body'>
          <h1 className='muxi-auth-form-heading'>{title}</h1>
          {subtitle && <p className='muxi-auth-form-subtitle'>{subtitle}</p>}
          {children}
          {footer}
        </div>
      </div>
    </div>
  );
};

export default AuthShell;

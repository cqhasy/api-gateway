import React from 'react';
import { getLogo, getSystemName } from '../../helpers';

const AuthShell = ({
  title,
  subtitle,
  brandDescription,
  children,
  footer,
}) => {
  const logo = getLogo();
  const systemName = getSystemName();

  return (
    <div className='muxi-auth-page'>
      <div className='muxi-auth-shell'>
        <div className='muxi-auth-brand'>
          <div>
            <img src={logo} alt={`${systemName} logo`} className='muxi-auth-brand-logo' width={40} height={40} />
            <h1>{systemName}</h1>
            {brandDescription && <p>{brandDescription}</p>}
          </div>
          <span className='auth-brand-footer'>MUXI · API Gateway</span>
        </div>

        <div className='muxi-auth-form'>
          <h2 className='muxi-auth-form-heading'>{title}</h2>
          {subtitle && <p className='muxi-auth-form-subtitle'>{subtitle}</p>}
          {children}
          {footer}
        </div>
      </div>
    </div>
  );
};

export default AuthShell;

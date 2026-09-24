import React from 'react';

const PageHeader = ({ title, description, actions, className = '' }) => {
  return (
    <header className={`muxi-page-header ${className}`.trim()}>
      <div>
        <h1 className='muxi-page-header-title'>{title}</h1>
        {description && <p className='muxi-page-header-desc'>{description}</p>}
      </div>
      {actions && <div className='muxi-page-header-actions'>{actions}</div>}
    </header>
  );
};

export default PageHeader;

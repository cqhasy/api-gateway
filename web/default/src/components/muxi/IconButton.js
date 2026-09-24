import React from 'react';
import { Icon } from 'semantic-ui-react';

const IconButton = ({
  icon,
  label,
  onClick,
  bordered = false,
  className = '',
  type = 'button',
  ...rest
}) => {
  return (
    <button
      type={type}
      className={[
        'muxi-icon-btn',
        bordered ? 'muxi-icon-btn--bordered' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={label}
      onClick={onClick}
      {...rest}
    >
      <Icon name={icon} aria-hidden='true' />
    </button>
  );
};

export default IconButton;

import React from 'react';

const Input = ({
  id,
  label,
  hint,
  error,
  className = '',
  inputClassName = '',
  mono = false,
  ...rest
}) => {
  const inputId = id || rest.name;
  const errorId = error && inputId ? `${inputId}-error` : undefined;
  const hintId = hint && inputId ? `${inputId}-hint` : undefined;

  return (
    <div className={`muxi-field ${className}`.trim()}>
      {label && (
        <label className='muxi-field-label' htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'muxi-input',
          mono ? 'muxi-input--mono' : '',
          error ? 'muxi-input--error' : '',
          inputClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        readOnly={rest.readOnly}
        {...rest}
      />
      {hint && !error && (
        <span id={hintId} className='muxi-field-hint'>
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className='muxi-field-error' role='alert'>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;

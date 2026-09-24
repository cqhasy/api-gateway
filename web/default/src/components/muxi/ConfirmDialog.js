import React, { useEffect, useRef } from 'react';
import Button from './Button';

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    cancelRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className='muxi-dialog-overlay'
      role='presentation'
      onClick={onCancel}
    >
      <div
        className='muxi-dialog'
        role='alertdialog'
        aria-modal='true'
        aria-labelledby='muxi-dialog-title'
        aria-describedby='muxi-dialog-body'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id='muxi-dialog-title' className='muxi-dialog-title'>
          {title}
        </h2>
        <p id='muxi-dialog-body' className='muxi-dialog-body'>
          {message}
        </p>
        <div className='muxi-dialog-actions'>
          <Button ref={cancelRef} variant='secondary' onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

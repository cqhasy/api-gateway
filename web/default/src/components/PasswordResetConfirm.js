import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API, copy, showError, showNotice } from '../helpers';
import { AuthShell, Button, Input } from './muxi';

const PasswordResetConfirm = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({ email: '', token: '' });
  const { email, token } = inputs;
  const [loading, setLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setInputs({
      token: searchParams.get('token') || '',
      email: searchParams.get('email') || '',
    });
  }, [searchParams]);

  useEffect(() => {
    let countdownInterval = null;
    if (disableButton && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (countdown === 0) {
      setDisableButton(false);
      setCountdown(30);
    }
    return () => clearInterval(countdownInterval);
  }, [disableButton, countdown]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setDisableButton(true);
    setLoading(true);
    try {
      const res = await API.post('/api/user/reset', { email, token });
      const { success, message } = res.data;
      if (success) {
        const password = res.data.data;
        setNewPassword(password);
        await copy(password);
        showNotice(t('messages.notice.password_copied', { password }));
      } else {
        showError(message);
        setDisableButton(false);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleCopyPassword = async () => {
    if (!newPassword) return;
    await copy(newPassword);
    showNotice(t('auth.reset.confirm.notice'));
  };

  return (
    <AuthShell
      title={t('auth.reset.confirm.title')}
      subtitle={t('auth.reset.confirm.subtitle')}
      brandDescription={t('auth.reset.brand_desc')}
      footer={
        <div className='muxi-auth-footer muxi-auth-footer--center'>
          <Link to='/login' className='muxi-auth-link'>
            {t('auth.reset.back_login')}
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className='muxi-auth-field-stack'>
          <Input
            id='reset-confirm-email'
            name='email'
            type='email'
            label={t('auth.reset.email')}
            value={email}
            readOnly
          />

          {newPassword && (
            <Input
              id='reset-confirm-password'
              name='newPassword'
              label={t('auth.reset.confirm.new_password')}
              value={newPassword}
              readOnly
              mono
              inputClassName='muxi-auth-password-display'
              onClick={handleCopyPassword}
            />
          )}

          <Button
            type='submit'
            variant='primary'
            size='lg'
            block
            loading={loading}
            disabled={disableButton || !!newPassword}
            className='muxi-auth-submit'
          >
            {newPassword
              ? t('auth.reset.confirm.button_disabled')
              : disableButton
                ? t('auth.register.get_code_retry', { countdown })
                : t('auth.reset.confirm.button')}
          </Button>
        </div>
      </form>

      {newPassword && (
        <p className='muxi-auth-notice'>{t('auth.reset.confirm.notice')}</p>
      )}
    </AuthShell>
  );
};

export default PasswordResetConfirm;

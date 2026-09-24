import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API, showError, showInfo, showSuccess } from '../helpers';
import Turnstile from 'react-turnstile';
import { AuthShell, Button, Input } from './muxi';

const PasswordResetForm = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const status = localStorage.getItem('status');
    if (status) {
      const parsed = JSON.parse(status);
      if (parsed.turnstile_check) {
        setTurnstileEnabled(true);
        setTurnstileSiteKey(parsed.turnstile_site_key);
      }
    }
  }, []);

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
    if (turnstileEnabled && turnstileToken === '') {
      showInfo(t('messages.error.turnstile_wait'));
      return;
    }
    setDisableButton(true);
    setLoading(true);
    try {
      const res = await API.get(
        `/api/reset_password?email=${email}&turnstile=${turnstileToken}`
      );
      const { success, message } = res.data;
      if (success) {
        showSuccess(t('auth.reset.notice'));
        setEmail('');
      } else {
        showError(message);
        setDisableButton(false);
        setCountdown(30);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title={t('auth.reset.title')}
      subtitle={t('auth.reset.subtitle')}
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
            id='reset-email'
            name='email'
            type='email'
            label={t('auth.reset.email')}
            placeholder={t('auth.reset.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete='email'
          />

          {turnstileEnabled && (
            <div className='muxi-auth-turnstile'>
              <Turnstile sitekey={turnstileSiteKey} onVerify={setTurnstileToken} />
            </div>
          )}

          <Button
            type='submit'
            variant='primary'
            size='lg'
            block
            loading={loading}
            disabled={disableButton}
            className='muxi-auth-submit'
          >
            {disableButton
              ? t('auth.register.get_code_retry', { countdown })
              : t('auth.reset.button')}
          </Button>
        </div>
      </form>

      <p className='muxi-auth-notice'>{t('auth.reset.notice')}</p>
    </AuthShell>
  );
};

export default PasswordResetForm;

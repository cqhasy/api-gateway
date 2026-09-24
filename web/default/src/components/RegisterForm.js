import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API, showError, showInfo, showSuccess } from '../helpers';
import Turnstile from 'react-turnstile';
import { AuthShell, Button, Input } from './muxi';

const RegisterForm = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    password2: '',
    email: '',
    verification_code: '',
  });
  const { username, password, password2, email, verification_code } = inputs;
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [countdown, setCountdown] = useState(30);
  let affCode = new URLSearchParams(window.location.search).get('aff');
  if (affCode) {
    localStorage.setItem('aff', affCode);
  }

  useEffect(() => {
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      setShowEmailVerification(status.email_verification);
      if (status.turnstile_check) {
        setTurnstileEnabled(true);
        setTurnstileSiteKey(status.turnstile_site_key);
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

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 8) {
      showInfo(t('messages.error.password_length'));
      return;
    }
    if (password !== password2) {
      showInfo(t('messages.error.password_mismatch'));
      return;
    }
    if (!username || !password) return;
    if (turnstileEnabled && turnstileToken === '') {
      showInfo(t('messages.error.turnstile_wait'));
      return;
    }
    setLoading(true);
    try {
      if (!affCode) {
        affCode = localStorage.getItem('aff');
      }
      const payload = { ...inputs, aff_code: affCode };
      const res = await API.post(
        `/api/user/register?turnstile=${turnstileToken}`,
        payload
      );
      const { success, message } = res.data;
      if (success) {
        navigate('/login');
        showSuccess(t('messages.success.register'));
      } else {
        showError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  const sendVerificationCode = async () => {
    if (email === '') return;
    if (turnstileEnabled && turnstileToken === '') {
      showInfo(t('messages.error.turnstile_wait'));
      return;
    }
    setDisableButton(true);
    setLoading(true);
    try {
      const res = await API.get(
        `/api/verification?email=${email}&turnstile=${turnstileToken}`
      );
      const { success, message } = res.data;
      if (success) {
        showSuccess(t('messages.success.verification_code'));
      } else {
        showError(message);
        setDisableButton(false);
        setCountdown(30);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={t('auth.register.title')}
      subtitle={t('auth.register.subtitle')}
      brandDescription={t('auth.register.description')}
      footer={
        <div className='muxi-auth-footer muxi-auth-footer--center'>
          {t('auth.register.has_account')}
          <Link to='/login' className='muxi-auth-link'>
            {t('auth.register.login')}
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className='muxi-auth-field-stack'>
          <Input
            id='register-username'
            name='username'
            label={t('auth.register.username')}
            placeholder={t('auth.register.username')}
            value={username}
            onChange={handleChange}
            autoComplete='username'
            spellCheck={false}
          />
          <Input
            id='register-password'
            name='password'
            type='password'
            label={t('auth.register.password')}
            placeholder={t('auth.register.password')}
            value={password}
            onChange={handleChange}
            autoComplete='new-password'
          />
          <Input
            id='register-password2'
            name='password2'
            type='password'
            label={t('auth.register.confirm_password')}
            placeholder={t('auth.register.confirm_password')}
            value={password2}
            onChange={handleChange}
            autoComplete='new-password'
          />

          {showEmailVerification && (
            <>
              <div className='muxi-input-with-action'>
                <Input
                  id='register-email'
                  name='email'
                  type='email'
                  label={t('auth.register.email')}
                  placeholder={t('auth.register.email')}
                  value={email}
                  onChange={handleChange}
                  autoComplete='email'
                />
                <Button
                  type='button'
                  variant='secondary'
                  disabled={loading || disableButton}
                  onClick={sendVerificationCode}
                >
                  {disableButton
                    ? t('auth.register.get_code_retry', { countdown })
                    : t('auth.register.get_code')}
                </Button>
              </div>
              <Input
                id='register-code'
                name='verification_code'
                label={t('auth.register.verification_code')}
                placeholder={t('auth.register.verification_code')}
                value={verification_code}
                onChange={handleChange}
                autoComplete='off'
                spellCheck={false}
              />
            </>
          )}

          {turnstileEnabled && (
            <div className='muxi-auth-turnstile'>
              <Turnstile sitekey={turnstileSiteKey} onVerify={setTurnstileToken} />
            </div>
          )}

          <Button type='submit' variant='primary' size='lg' block loading={loading} className='muxi-auth-submit'>
            {t('auth.register.button')}
          </Button>
        </div>
      </form>
    </AuthShell>
  );
};

export default RegisterForm;

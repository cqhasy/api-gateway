import React, { useContext, useEffect, useState } from 'react';
import { Icon, Modal } from 'semantic-ui-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../context/User';
import { API, showError, showSuccess, showWarning } from '../helpers';
import { onGitHubOAuthClicked, onLarkOAuthClicked } from './utils';
import { AuthShell, Button, Input } from './muxi';
import larkIcon from '../images/lark.svg';

const LoginForm = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    wechat_verification_code: '',
  });
  const [searchParams] = useSearchParams();
  const { username, password } = inputs;
  const [, userDispatch] = useContext(UserContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [showWeChatLoginModal, setShowWeChatLoginModal] = useState(false);

  useEffect(() => {
    if (searchParams.get('expired')) {
      showError(t('messages.error.login_expired'));
    }
    const stored = localStorage.getItem('status');
    if (stored) {
      setStatus(JSON.parse(stored));
    }
  }, [searchParams, t]);

  const onSubmitWeChatVerificationCode = async () => {
    const res = await API.get(
      `/api/oauth/wechat?code=${inputs.wechat_verification_code}`
    );
    const { success, message, data } = res.data;
    if (success) {
      userDispatch({ type: 'login', payload: data });
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/');
      showSuccess(t('messages.success.login'));
      setShowWeChatLoginModal(false);
    } else {
      showError(message);
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    try {
      const res = await API.post('/api/user/login', { username, password });
      const { success, message, data } = res.data;
      if (success) {
        userDispatch({ type: 'login', payload: data });
        localStorage.setItem('user', JSON.stringify(data));
        if (username === 'root' && password === '123456') {
          navigate('/user/edit');
          showSuccess(t('messages.success.login'));
          showWarning(t('messages.error.root_password'));
        } else {
          navigate('/token');
          showSuccess(t('messages.success.login'));
        }
      } else {
        showError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  const hasOAuth = status.github_oauth || status.wechat_login || status.lark_client_id;

  return (
    <>
      <AuthShell
        title={t('auth.login.title')}
        subtitle={t('auth.login.subtitle')}
        brandDescription={t('auth.login.brand_desc')}
        footer={
          <div className='muxi-auth-footer muxi-auth-links-row'>
            <div>
              {t('auth.login.forgot_password')}
              <Link to='/reset' className='muxi-auth-link'>
                {t('auth.login.reset_password')}
              </Link>
            </div>
            <div>
              {t('auth.login.no_account')}
              <Link to='/register' className='muxi-auth-link'>
                {t('auth.login.register')}
              </Link>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className='muxi-auth-field-stack'>
            <Input
              id='login-username'
              name='username'
              label={t('auth.login.username')}
              placeholder={t('auth.login.username')}
              value={username}
              onChange={handleChange}
              autoComplete='username'
              spellCheck={false}
            />
            <Input
              id='login-password'
              name='password'
              type='password'
              label={t('auth.login.password')}
              placeholder={t('auth.login.password')}
              value={password}
              onChange={handleChange}
              autoComplete='current-password'
            />
            <Button type='submit' variant='primary' size='lg' block loading={loading} className='muxi-auth-submit'>
              {t('auth.login.button')}
            </Button>
          </div>
        </form>

        {hasOAuth && (
          <>
            <div className='muxi-auth-divider'>{t('auth.login.other_methods')}</div>
            <div className='muxi-auth-oauth'>
              {status.github_oauth && (
                <button
                  type='button'
                  className='muxi-auth-oauth-btn muxi-auth-oauth-btn--github'
                  aria-label='GitHub login'
                  onClick={() => onGitHubOAuthClicked(status.github_client_id)}
                >
                  <Icon name='github' aria-hidden='true' />
                </button>
              )}
              {status.wechat_login && (
                <button
                  type='button'
                  className='muxi-auth-oauth-btn muxi-auth-oauth-btn--wechat'
                  aria-label='WeChat login'
                  onClick={() => setShowWeChatLoginModal(true)}
                >
                  <Icon name='wechat' aria-hidden='true' />
                </button>
              )}
              {status.lark_client_id && (
                <button
                  type='button'
                  className='muxi-auth-oauth-btn'
                  aria-label='Lark login'
                  onClick={() => onLarkOAuthClicked(status.lark_client_id)}
                >
                  <img src={larkIcon} alt='' />
                </button>
              )}
            </div>
          </>
        )}
      </AuthShell>

      <Modal open={showWeChatLoginModal} onClose={() => setShowWeChatLoginModal(false)} size='mini'>
        <Modal.Content className='muxi-wechat-modal'>
          <img src={status.wechat_qrcode} alt='WeChat QR code' width={280} height={280} />
          <p className='muxi-wechat-modal-tip'>{t('auth.login.wechat.scan_tip')}</p>
          <div className='muxi-auth-field-stack'>
            <Input
              id='wechat-code'
              name='wechat_verification_code'
              placeholder={t('auth.login.wechat.code_placeholder')}
              value={inputs.wechat_verification_code}
              onChange={handleChange}
              autoComplete='off'
              spellCheck={false}
            />
            <Button type='button' variant='primary' size='lg' block onClick={onSubmitWeChatVerificationCode}>
              {t('auth.login.button')}
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default LoginForm;

import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { API, showError, showNotice, timestamp2string } from '../../helpers';
import { StatusContext } from '../../context/Status';
import { marked } from 'marked';
import { UserContext } from '../../context/User';

const StatusPill = ({ enabled, enabledLabel, disabledLabel }) => (
  <span className={enabled ? 'muxi-status-on' : 'muxi-status-off'}>
    {enabled ? enabledLabel : disabledLabel}
  </span>
);

const Home = () => {
  const { t } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [userState] = useContext(UserContext);

  const displayNotice = async () => {
    const res = await API.get('/api/notice');
    const { success, message, data } = res.data;
    if (success) {
      const oldNotice = localStorage.getItem('notice');
      if (data !== oldNotice && data !== '') {
        showNotice(marked(data), true);
        localStorage.setItem('notice', data);
      }
    } else {
      showError(message);
    }
  };

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);
    } else {
      showError(message);
      setHomePageContent(t('home.loading_failed'));
    }
    setHomePageContentLoaded(true);
  };

  useEffect(() => {
    displayNotice().then();
    displayHomePageContent().then();
  }, []);

  if (!homePageContentLoaded) return null;

  if (homePageContent !== '') {
    if (homePageContent.startsWith('https://')) {
      return (
        <iframe src={homePageContent} title='Home page content'
          style={{ width: '100%', minHeight: 'calc(100dvh - 160px)', border: 'none', borderRadius: 'var(--muxi-radius-lg)' }} />
      );
    }
    return (
      <div className='muxi-markdown-content' style={{ fontSize: '1rem', lineHeight: 1.65 }}
        dangerouslySetInnerHTML={{ __html: homePageContent }} />
    );
  }

  const status = statusState?.status || {};

  return (
    <div className='muxi-animate-in'>
      {/* ── Hero Section ── */}
      <section className='muxi-home-hero'>
        <div className='muxi-home-hero-text'>
          <div className='muxi-accent-bar' />
          <h1>{t('home.welcome.title')}</h1>
          <p>{t('home.welcome.description')}</p>
          <div className='muxi-home-hero-actions'>
            {!userState.user ? (
              <>
                <Button as={Link} to='/login' className='muxi-btn-primary' size='large'>
                  {t('header.login')}
                </Button>
                <Button as={Link} to='/register' className='muxi-btn-ghost' size='large'>
                  {t('header.register')}
                </Button>
              </>
            ) : (
              <Button as={Link} to='/token' className='muxi-btn-accent' size='large'>
                {t('header.token')}
              </Button>
            )}
          </div>
          {!userState.user && (
            <p className='muxi-home-hero-hint'>{t('home.welcome.login_notice')}</p>
          )}
        </div>
        <div className='muxi-home-hero-stats'>
          <div className='muxi-stat-item'>
            <label>{t('home.system_status.info.version')}</label>
            <span>{status.version || '—'}</span>
          </div>
          <div className='muxi-stat-item'>
            <label>{t('home.system_status.info.start_time')}</label>
            <span>{timestamp2string(status.start_time) || '—'}</span>
          </div>
          <div className='muxi-stat-item'>
            <label>{t('home.system_status.config.email_verify')}</label>
            <StatusPill enabled={status.email_verification} enabledLabel={t('home.system_status.config.enabled')} disabledLabel={t('home.system_status.config.disabled')} />
          </div>
          <div className='muxi-stat-item'>
            <label>{t('home.system_status.config.github_oauth')}</label>
            <StatusPill enabled={status.github_oauth} enabledLabel={t('home.system_status.config.enabled')} disabledLabel={t('home.system_status.config.disabled')} />
          </div>
        </div>
      </section>

      {/* ── Config Status ── */}
      <section className='muxi-section'>
        <h3 className='muxi-section-title'>{t('home.system_status.config.title')}</h3>
        <div className='muxi-grid-auto'>
          <div className='muxi-stat-item'>
            <label>{t('home.system_status.info.name')}</label>
            <span>{status.system_name || '—'}</span>
          </div>
          <div className='muxi-stat-item'>
            <label>{t('home.system_status.config.wechat_login')}</label>
            <StatusPill enabled={status.wechat_login} enabledLabel={t('home.system_status.config.enabled')} disabledLabel={t('home.system_status.config.disabled')} />
          </div>
          <div className='muxi-stat-item'>
            <label>{t('home.system_status.config.turnstile')}</label>
            <StatusPill enabled={status.turnstile_check} enabledLabel={t('home.system_status.config.enabled')} disabledLabel={t('home.system_status.config.disabled')} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

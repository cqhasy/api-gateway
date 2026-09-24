import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { API, getSystemName, isAdmin, showError, showNotice, timestamp2string } from '../../helpers';
import { StatusContext } from '../../context/Status';
import { marked } from 'marked';
import { UserContext } from '../../context/User';
import { Badge } from '../../components/muxi';

const QUICK_LINKS = [
  { to: '/token', icon: 'key', labelKey: 'header.token', auth: true },
  { to: '/dashboard', icon: 'chart bar', labelKey: 'header.dashboard', auth: true },
  { to: '/channel', icon: 'sitemap', labelKey: 'header.channel', auth: true, admin: true },
  { to: '/log', icon: 'book', labelKey: 'header.log', auth: true },
];

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [userState] = useContext(UserContext);
  const systemName = getSystemName();

  useEffect(() => {
    const load = async () => {
      try {
        const noticeRes = await API.get('/api/notice');
        if (noticeRes.data.success) {
          const data = noticeRes.data.data;
          const oldNotice = localStorage.getItem('notice');
          if (data !== oldNotice && data !== '') {
            showNotice(marked(data), true);
            localStorage.setItem('notice', data);
          }
        }
      } catch (e) {
        /* ignore notice errors on home */
      }

      setHomePageContent(localStorage.getItem('home_page_content') || '');
      try {
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
      } catch (error) {
        showError(error.message);
        setHomePageContent(t('home.loading_failed'));
      }
      setHomePageContentLoaded(true);
    };
    load();
  }, [t]);

  if (!homePageContentLoaded) {
    return (
      <div className='muxi-home-loading muxi-home-loading--studio'>
        <div className='muxi-skeleton muxi-home-loading-hero' />
        <div className='muxi-skeleton muxi-home-loading-panel' />
      </div>
    );
  }

  if (homePageContent !== '') {
    if (homePageContent.startsWith('https://')) {
      return (
        <iframe
          src={homePageContent}
          title={t('home.custom_content_title')}
          className='muxi-home-iframe'
        />
      );
    }
    return (
      <div
        className='muxi-markdown-content muxi-home-markdown'
        dangerouslySetInnerHTML={{ __html: homePageContent }}
      />
    );
  }

  const status = statusState?.status || {};
  const locale = i18n.language?.startsWith('zh') ? 'zh-CN' : 'en-US';

  const startTimeLabel = status.start_time
    ? new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(status.start_time * 1000))
    : timestamp2string(status.start_time) || '—';

  const systemStats = [
    { label: t('home.system_status.info.name'), value: systemName },
    { label: t('home.system_status.info.version'), value: status.version || '—' },
    { label: t('home.system_status.info.start_time'), value: startTimeLabel },
    {
      label: t('home.system_status.config.email_verify'),
      value: (
        <Badge variant={status.email_verification ? 'success' : 'default'} pulse={status.email_verification}>
          {status.email_verification
            ? t('home.system_status.config.enabled')
            : t('home.system_status.config.disabled')}
        </Badge>
      ),
    },
  ];

  const configItems = [
    { label: t('home.system_status.config.email_verify'), enabled: status.email_verification },
    { label: t('home.system_status.config.github_oauth'), enabled: status.github_oauth },
    { label: t('home.system_status.config.wechat_login'), enabled: status.wechat_login },
    { label: t('home.system_status.config.turnstile'), enabled: status.turnstile_check },
  ];

  const visibleQuickLinks = QUICK_LINKS.filter((item) => {
    if (item.admin && !isAdmin()) return false;
    if (item.auth && !userState.user) return false;
    return true;
  });

  return (
    <div className='muxi-animate-in muxi-home muxi-home--studio'>
      <header className='muxi-studio-hero'>
        <p className='muxi-studio-kicker'>MUXI API</p>
        <h1>{t('home.welcome.title', { name: systemName })}</h1>
        <p className='muxi-studio-lead'>{t('home.welcome.description')}</p>
        {!userState.user && (
          <p className='muxi-studio-hint'>{t('home.welcome.login_notice')}</p>
        )}
        <div className='muxi-studio-actions'>
          {!userState.user ? (
            <>
              <Link to='/login' className='muxi-btn muxi-btn--primary'>
                {t('header.login')}
              </Link>
              <Link to='/register' className='muxi-btn muxi-btn--secondary'>
                {t('header.register')}
              </Link>
            </>
          ) : (
            <Link to='/token' className='muxi-btn muxi-btn--primary'>
              {t('home.welcome.cta_token')}
            </Link>
          )}
        </div>
      </header>

      <section className='muxi-studio-panel'>
        <h2 className='muxi-studio-panel-title'>{t('home.system_status.info.title')}</h2>
        <dl className='muxi-studio-stats'>
          {systemStats.map((item) => (
            <div key={item.label} className='muxi-studio-stat'>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {userState.user && visibleQuickLinks.length > 0 && (
        <section className='muxi-studio-panel'>
          <h2 className='muxi-studio-panel-title'>{t('home.quick_links.title')}</h2>
          <ul className='muxi-studio-link-list'>
            {visibleQuickLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className='muxi-studio-link'>
                  <Icon name={item.icon} aria-hidden='true' />
                  <span>{t(item.labelKey)}</span>
                  <Icon name='chevron right' className='muxi-studio-link-chevron' aria-hidden='true' />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className='muxi-studio-panel muxi-studio-panel--last'>
        <h2 className='muxi-studio-panel-title'>{t('home.system_status.config.title')}</h2>
        <ul className='muxi-studio-config-list'>
          {configItems.map((item) => (
            <li key={item.label} className='muxi-studio-config-row'>
              <span>{item.label}</span>
              <Badge variant={item.enabled ? 'success' : 'default'}>
                {item.enabled
                  ? t('home.system_status.config.enabled')
                  : t('home.system_status.config.disabled')}
              </Badge>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Home;

import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/User';
import { useTranslation } from 'react-i18next';
import { Icon } from 'semantic-ui-react';
import { API, getSystemName, isAdmin, showSuccess } from '../helpers';
import { BrandLockup } from './muxi';
import { NAV_GROUPS } from '../constants/nav';

const Sidebar = () => {
  const { t } = useTranslation();
  const [userState, userDispatch] = useContext(UserContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasChat, setHasChat] = useState(!!localStorage.getItem('chat_link'));
  const navigate = useNavigate();
  const location = useLocation();
  const systemName = getSystemName();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onStorage = () => setHasChat(!!localStorage.getItem('chat_link'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const logout = async () => {
    await API.get('/api/user/logout');
    showSuccess('注销成功');
    userDispatch({ type: 'logout' });
    localStorage.removeItem('user');
    navigate('/login');
  };

  const visibleGroups = NAV_GROUPS.filter((group) => {
    if (group.admin && !isAdmin()) return false;
    const visibleItems = group.items.filter((item) => {
      if (item.admin && !isAdmin()) return false;
      if (item.auth && !userState.user) return false;
      if (item.chatOnly && !hasChat) return false;
      return true;
    });
    return visibleItems.length > 0;
  });

  return (
    <>
      <header className='muxi-mobile-bar'>
        <button
          type='button'
          className='muxi-mobile-menu-btn'
          aria-label={mobileOpen ? t('nav.close_menu') : t('nav.open_menu')}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <Icon name={mobileOpen ? 'close' : 'sidebar'} aria-hidden='true' />
        </button>
        <Link to='/' className='muxi-mobile-brand' aria-label={systemName}>
          <BrandLockup markSize={22} className='muxi-brand-lockup--compact' />
        </Link>
        <button
          type='button'
          className='muxi-mobile-cmd-btn'
          aria-label={t('nav.command_palette')}
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
        >
          <Icon name='search' aria-hidden='true' />
        </button>
      </header>

      {mobileOpen && (
        <div
          className='muxi-sidebar-overlay'
          role='presentation'
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`muxi-sidebar${mobileOpen ? ' muxi-sidebar--open' : ''}`}>
        <Link to='/' className='muxi-sidebar-brand muxi-sidebar-brand--desktop' aria-label={systemName}>
          <BrandLockup />
        </Link>

        <button
          type='button'
          className='muxi-sidebar-cmd-trigger'
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
        >
          <Icon name='search' aria-hidden='true' />
          <span>{t('nav.command_placeholder')}</span>
          <kbd>⌘K</kbd>
        </button>

        <nav className='muxi-sidebar-nav' aria-label={t('nav.main')}>
          {visibleGroups.map((group) => {
            const items = group.items.filter((item) => {
              if (item.admin && !isAdmin()) return false;
              if (item.auth && !userState.user) return false;
              if (item.chatOnly && !hasChat) return false;
              return true;
            });
            if (items.length === 0) return null;

            return (
              <div key={group.labelKey} className='muxi-sidebar-group'>
                <div className='muxi-sidebar-group-label'>{t(group.labelKey)}</div>
                {items.map((item) => {
                  const active = isActive(item.to);
                  return (
                    <Link
                      key={item.name}
                      to={item.to}
                      className={`muxi-sidebar-item${active ? ' active' : ''}`}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon name={item.icon} aria-hidden='true' />
                      <span>{t(item.name)}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className='muxi-sidebar-spacer' />

        {userState.user ? (
          <div className='muxi-sidebar-user'>
            <div className='muxi-sidebar-user-avatar' aria-hidden='true'>
              {userState.user.username.charAt(0).toUpperCase()}
            </div>
            <div className='muxi-sidebar-user-info'>
              <span className='muxi-sidebar-user-name'>{userState.user.username}</span>
              <button type='button' className='muxi-sidebar-logout' onClick={logout}>
                {t('header.logout')}
              </button>
            </div>
          </div>
        ) : (
          <div className='muxi-sidebar-user'>
            <Link to='/login' className='muxi-sidebar-login-btn'>
              {t('header.login')}
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;

import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/User';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Container,
  Dropdown,
  Icon,
  Menu,
  Segment,
} from 'semantic-ui-react';
import {
  API,
  getLogo,
  getSystemName,
  isAdmin,
  isMobile,
  showSuccess,
} from '../helpers';

let headerButtons = [
  { name: 'header.channel', to: '/channel', icon: 'sitemap', admin: true },
  { name: 'header.token', to: '/token', icon: 'key' },
  { name: 'header.redemption', to: '/redemption', icon: 'dollar sign', admin: true },
  { name: 'header.topup', to: '/topup', icon: 'cart' },
  { name: 'header.user', to: '/user', icon: 'user', admin: true },
  { name: 'header.dashboard', to: '/dashboard', icon: 'chart bar' },
  { name: 'header.log', to: '/log', icon: 'book' },
  { name: 'header.setting', to: '/setting', icon: 'setting' },
  { name: 'header.about', to: '/about', icon: 'info circle' },
];

if (localStorage.getItem('chat_link')) {
  headerButtons.splice(1, 0, {
    name: 'header.chat',
    to: '/chat',
    icon: 'comments',
  });
}

const Header = () => {
  const { t, i18n } = useTranslation();
  const [userState, userDispatch] = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const systemName = getSystemName();
  const logo = getLogo();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  async function logout() {
    setShowSidebar(false);
    await API.get('/api/user/logout');
    showSuccess('注销成功');
    userDispatch({ type: 'logout' });
    localStorage.removeItem('user');
    navigate('/login');
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const renderButtons = (mobile) => {
    return headerButtons.map((button) => {
      if (button.admin && !isAdmin()) return null;
      const active = isActive(button.to);
      if (mobile) {
        return (
          <Menu.Item
            key={button.name}
            className={active ? 'muxi-nav-link active' : 'muxi-nav-link'}
            onClick={() => {
              navigate(button.to);
              setShowSidebar(false);
            }}
          >
            <Icon name={button.icon} />
            {t(button.name)}
          </Menu.Item>
        );
      }
      return (
        <Menu.Item
          key={button.name}
          as={Link}
          to={button.to}
          className={active ? 'muxi-nav-link active' : 'muxi-nav-link'}
        >
          <Icon name={button.icon} style={{ marginRight: '4px' }} />
          {t(button.name)}
        </Menu.Item>
      );
    });
  };

  const languageOptions = [
    { key: 'zh', text: '中文', value: 'zh' },
    { key: 'en', text: 'English', value: 'en' },
  ];

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  const brandBlock = (
    <Menu.Item as={Link} to='/' className='muxi-brand hide-on-mobile'>
      <img src={logo} alt={`${systemName} logo`} />
      <span className='muxi-brand-name'>{systemName}</span>
    </Menu.Item>
  );

  const authControls = userState.user ? (
    <Dropdown
      text={userState.user.username}
      pointing
      className='link item muxi-nav-link'
    >
      <Dropdown.Menu>
        <Dropdown.Item onClick={logout}>{t('header.logout')}</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  ) : (
    <Button as={Link} to='/login' className='muxi-btn-primary' style={{ margin: '0 0.5rem' }}>
      {t('header.login')}
    </Button>
  );

  if (isMobile()) {
    return (
      <header className='muxi-header'>
        <Menu borderless size='large'>
          <Container fluid style={{ padding: '0 12px' }}>
            <Menu.Item as={Link} to='/' className='muxi-brand'>
              <img src={logo} alt={`${systemName} logo`} />
              <span className='muxi-brand-name'>{systemName}</span>
            </Menu.Item>
            <Menu.Menu position='right'>
              <Menu.Item onClick={toggleSidebar} aria-label='Toggle menu'>
                <Icon name={showSidebar ? 'close' : 'sidebar'} />
              </Menu.Item>
            </Menu.Menu>
          </Container>
        </Menu>
        {showSidebar && (
          <Segment className='muxi-mobile-drawer'>
            <Menu secondary vertical style={{ width: '100%', margin: 0 }}>
              {renderButtons(true)}
              <Menu.Item>
                <Dropdown
                  selection
                  trigger={<Icon name='language' />}
                  options={languageOptions}
                  value={i18n.language}
                  onChange={(_, { value }) => changeLanguage(value)}
                />
              </Menu.Item>
              <Menu.Item>
                {userState.user ? (
                  <Button onClick={logout} className='muxi-btn-ghost' fluid>
                    {t('header.logout')}
                  </Button>
                ) : (
                  <>
                    <Button
                      className='muxi-btn-primary'
                      fluid
                      onClick={() => {
                        setShowSidebar(false);
                        navigate('/login');
                      }}
                    >
                      {t('header.login')}
                    </Button>
                    <Button
                      className='muxi-btn-ghost'
                      fluid
                      style={{ marginTop: '0.5rem' }}
                      onClick={() => {
                        setShowSidebar(false);
                        navigate('/register');
                      }}
                    >
                      {t('header.register')}
                    </Button>
                  </>
                )}
              </Menu.Item>
            </Menu>
          </Segment>
        )}
      </header>
    );
  }

  return (
    <header className='muxi-header'>
      <Menu borderless>
        <Container>
          {brandBlock}
          {renderButtons(false)}
          <Menu.Menu position='right'>
            <Dropdown
              item
              trigger={<Icon name='language' />}
              options={languageOptions}
              value={i18n.language}
              onChange={(_, { value }) => changeLanguage(value)}
              className='muxi-nav-link'
            />
            {authControls}
          </Menu.Menu>
        </Container>
      </Menu>
    </header>
  );
};

export default Header;

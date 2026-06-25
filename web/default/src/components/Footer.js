import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Segment } from 'semantic-ui-react';
import { getFooterHTML, getSystemName } from '../helpers';

const Footer = () => {
  const { t } = useTranslation();
  const systemName = getSystemName();
  const [footer, setFooter] = useState(getFooterHTML());
  const remainCheckTimes = useRef(5);

  const loadFooter = () => {
    const footerHtml = localStorage.getItem('footer_html');
    if (footerHtml) {
      setFooter(footerHtml);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (remainCheckTimes.current <= 0) {
        clearInterval(timer);
        return;
      }
      remainCheckTimes.current -= 1;
      loadFooter();
    }, 200);
    return () => clearInterval(timer);
  }, []);

  return (
    <Segment vertical className='muxi-footer'>
      <Container textAlign='center'>
        {footer ? (
          <div className='custom-footer' dangerouslySetInnerHTML={{ __html: footer }} />
        ) : (
          <div className='custom-footer'>
            <strong style={{ color: 'var(--muxi-ink)', letterSpacing: '0.04em' }}>{systemName}</strong>
            {' · '}
            {process.env.REACT_APP_VERSION}
            {' · '}
            <a href='https://github.com/songquanpeng/one-api' target='_blank' rel='noreferrer'>
              {t('footer.built_by_name')}
            </a>
            {' · '}
            <a href='https://opensource.org/licenses/mit-license.php' rel='noreferrer'>
              {t('footer.mit')}
            </a>
          </div>
        )}
      </Container>
    </Segment>
  );
};

export default Footer;

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'semantic-ui-react';
import { API, showError } from '../../helpers';
import { marked } from 'marked';

const About = () => {
  const { t } = useTranslation();
  const [about, setAbout] = useState('');
  const [aboutLoaded, setAboutLoaded] = useState(false);

  const displayAbout = async () => {
    setAbout(localStorage.getItem('about') || '');
    const res = await API.get('/api/about');
    const { success, message, data } = res.data;
    if (success) {
      let aboutContent = data;
      if (!data.startsWith('https://')) {
        aboutContent = marked.parse(data);
      }
      setAbout(aboutContent);
      localStorage.setItem('about', aboutContent);
    } else {
      showError(message);
      setAbout(t('about.loading_failed'));
    }
    setAboutLoaded(true);
  };

  useEffect(() => {
    displayAbout().then();
  }, []);

  return (
    <div className='muxi-animate-in'>
      {aboutLoaded && about === '' ? (
        <>
          <h1 className='muxi-page-title'>{t('about.title')}</h1>
          <p className='muxi-page-subtitle'>{t('about.description')}</p>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t('about.repository')}
            <a href='https://github.com/songquanpeng/one-api' style={{ color: 'var(--accent)' }}>
              https://github.com/songquanpeng/one-api
            </a>
          </p>
        </>
      ) : (
        <>
          {about.startsWith('https://') ? (
            <iframe src={about} title='About' style={{ width: '100%', height: '100vh', border: 'none', borderRadius: 'var(--radius-lg)' }} />
          ) : (
            <div style={{ fontSize: 'larger', color: 'var(--text-primary)' }} dangerouslySetInnerHTML={{ __html: about }} />
          )}
        </>
      )}
    </div>
  );
};

export default About;

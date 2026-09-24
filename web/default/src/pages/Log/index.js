import React from 'react';
import { useTranslation } from 'react-i18next';
import LogsTable from '../../components/LogsTable';

const Log = () => {
  const { t } = useTranslation();
  return (
    <div className='muxi-animate-in'>
      <h1 className='muxi-page-title'>{t('log.title')}</h1>
      <p className='muxi-page-subtitle'>View API request logs, monitor usage, and troubleshoot issues.</p>
      <LogsTable />
    </div>
  );
};

export default Log;

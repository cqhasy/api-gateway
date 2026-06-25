import React from 'react';
import { Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RedemptionsTable from '../../components/RedemptionsTable';

const Redemption = () => {
  const { t } = useTranslation();
  return (
    <div className='muxi-animate-in'>
      <h1 className='muxi-page-title'>{t('redemption.title')}</h1>
      <p className='muxi-page-subtitle'>Create and manage redemption codes for quota top-ups.</p>
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        <Button as={Link} to='/redemption/add' className='muxi-btn-accent'><Icon name='plus' /> Add Code</Button>
      </div>
      <RedemptionsTable />
    </div>
  );
};

export default Redemption;

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Button, Label, Pagination, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { API, copy, showError, showSuccess, showWarning, timestamp2string } from '../../helpers';
import { ITEMS_PER_PAGE } from '../../constants';
import { renderQuota } from '../../helpers/render';

const COPY_OPTIONS = [
  { key: 'raw', text: 'Raw', value: '' },
  { key: 'next', text: 'Next', value: 'next' },
  { key: 'opencat', text: 'OpenCat', value: 'opencat' },
  { key: 'lobe', text: 'LobeChat', value: 'lobechat' },
];

function TokenCard({ token, onCopy, onToggle, onDelete, t }) {
  const statusClass = token.status === 1 ? 'online' : token.status === 2 ? 'disabled' : token.status === 3 ? 'offline' : 'disabled';
  const statusLabel = token.status === 1 ? 'Enabled' : token.status === 2 ? 'Disabled' : token.status === 3 ? 'Expired' : 'Depleted';
  const expired = token.expired_time > 0 ? timestamp2string(token.expired_time) : 'Never';

  return (
    <div className='muxi-channel-card'>
      <div className='muxi-channel-card-header'>
        <div className='muxi-channel-card-provider'>
          <div className='muxi-channel-card-logo' style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            {(token.name || 'T')[0].toUpperCase()}
          </div>
          <div>
            <div className='muxi-channel-card-name'>{token.name || 'Unnamed'}</div>
            <div className='muxi-channel-card-type' style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem' }}>
              {token.key ? token.key.substring(0, 12) + '…' : '—'}
            </div>
          </div>
        </div>
        <span className={`muxi-status-dot ${statusClass}`} title={statusLabel} />
      </div>
      <div className='muxi-channel-card-metrics'>
        <div className='muxi-channel-metric'>
          <span className='muxi-channel-metric-label'>Remaining</span>
          <span className='muxi-channel-metric-value'>
            {token.unlimited_quota ? 'Unlimited' : renderQuota(token.remain_quota, t, 2)}
          </span>
        </div>
        <div className='muxi-channel-metric'>
          <span className='muxi-channel-metric-label'>Used</span>
          <span className='muxi-channel-metric-value'>{renderQuota(token.used_quota, t)}</span>
        </div>
        <div className='muxi-channel-metric'>
          <span className='muxi-channel-metric-label'>Expires</span>
          <span className='muxi-channel-metric-value'>{expired}</span>
        </div>
        <div className='muxi-channel-metric'>
          <span className='muxi-channel-metric-label'>Status</span>
          <span className='muxi-channel-metric-value' style={{ color: statusClass === 'online' ? 'var(--success)' : statusClass === 'offline' ? 'var(--warning)' : 'var(--text-muted)' }}>
            {statusLabel}
          </span>
        </div>
      </div>
      <div className='muxi-channel-card-actions' onClick={(e) => e.stopPropagation()}>
        <Popup trigger={<Button size='tiny'><Icon name='copy' />Copy</Button>} on='click' flowing hoverable>
          {COPY_OPTIONS.map((opt) => (
            <Button key={opt.key} size='mini' onClick={() => onCopy(token, opt.value)}>
              {opt.text}
            </Button>
          ))}
        </Popup>
        <Button size='tiny' onClick={() => onToggle(token)}>
          <Icon name={token.status === 1 ? 'pause' : 'play'} />{token.status === 1 ? 'Disable' : 'Enable'}
        </Button>
        <Button as={Link} to={`/token/edit/${token.id}`} size='tiny'><Icon name='edit' />Edit</Button>
      </div>
    </div>
  );
}

const Token = () => {
  const { t } = useTranslation();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activePage, setActivePage] = useState(1);

  const loadTokens = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/token/?p=0');
      if (res.data.success) setTokens(res.data.data || []);
      else showError(res.data.message);
    } catch (err) { showError(err.message); }
    setLoading(false);
  };

  useEffect(() => { loadTokens(); }, []);

  const handleCopy = async (token, type) => {
    try {
      const res = await API.get(`/api/token/?key=${token.key}&copy=true&type=${type}`);
      if (res.data.success) {
        copy(res.data.data).then(() => showSuccess('Copied!'));
      } else showError(res.data.message);
    } catch (err) { showError(err.message); }
  };

  const handleToggle = async (token) => {
    const newStatus = token.status === 1 ? 2 : 1;
    try {
      const res = await API.put('/api/token/?status_only=true', { id: token.id, status: newStatus });
      if (res.data.success) {
        showSuccess('Updated');
        // Original logic: only update the status field from server response
        const updated = res.data.data;
        setTokens((prev) => prev.map((t) =>
          t.key === token.key ? { ...t, status: updated ? updated.status : newStatus } : t
        ));
      } else {
        showError(res.data.message);
      }
    } catch (err) { showError(err.message); }
  };

  const filtered = search
    ? tokens.filter((t) => (t.name || '').toLowerCase().includes(search.toLowerCase()) || (t.key || '').toLowerCase().includes(search.toLowerCase()))
    : tokens;

  const paged = filtered.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);
  const enabledCount = tokens.filter((t) => t.status === 1).length;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) + (filtered.length % ITEMS_PER_PAGE === 0 ? 1 : 0);

  return (
    <div className='muxi-animate-in'>
      <h1 className='muxi-page-title'>{t('token.title')}</h1>
      <p className='muxi-page-subtitle'>Manage API tokens for model access. Create tokens to connect with OpenAI-compatible clients.</p>

      <div className='muxi-stat-bar'>
        <div className='muxi-stat-bar-item'><span className='muxi-stat-bar-label'>Total Tokens</span><span className='muxi-stat-bar-value'>{tokens.length}</span></div>
        <div className='muxi-stat-bar-item'><span className='muxi-stat-bar-label'>Enabled</span><span className='muxi-stat-bar-value success'>{enabledCount}</span></div>
        <div className='muxi-stat-bar-item'><span className='muxi-stat-bar-label'>Disabled/Expired</span><span className='muxi-stat-bar-value danger'>{tokens.length - enabledCount}</span></div>
        <div className='muxi-stat-bar-item'><span className='muxi-stat-bar-label'>Total Quota</span><span className='muxi-stat-bar-value'>{renderQuota(tokens.reduce((s, t) => s + (t.remain_quota || 0), 0), t)}</span></div>
      </div>

      <div className='muxi-search'>
        <Icon name='search' className='muxi-search-icon' />
        <input type='text' placeholder='Search tokens…' value={search} onChange={(e) => { setSearch(e.target.value); setActivePage(1); }} />
        <span className='muxi-search-hint'>⌘K</span>
      </div>

      <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.5rem' }}>
        <Button as={Link} to='/token/add' className='muxi-btn-accent'><Icon name='plus' /> Add Token</Button>
        <Button className='muxi-btn-ghost' onClick={loadTokens} loading={loading}><Icon name='refresh' /> Refresh</Button>
      </div>

      {loading ? (
        <div className='muxi-channel-grid'>
          {[1, 2, 3, 4].map((i) => <div key={i} className='muxi-skeleton' style={{ height: 200, borderRadius: 'var(--radius-lg)' }} />)}
        </div>
      ) : paged.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <Icon name='key' style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block', opacity: 0.3 }} />
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No tokens found</h3>
          <p>{search ? 'Try a different search.' : 'Create your first API token to get started.'}</p>
        </div>
      ) : (
        <>
          <div className='muxi-channel-grid'>
            {paged.map((token) => <TokenCard key={token.id} token={token} onCopy={handleCopy} onToggle={handleToggle} t={t} />)}
          </div>
          {totalPages > 1 && (
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <Pagination activePage={activePage} totalPages={totalPages} onPageChange={(_, { activePage }) => setActivePage(activePage)} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Token;

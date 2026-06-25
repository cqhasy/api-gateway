import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { API, showError, showSuccess, showInfo, timestamp2string } from '../../helpers';
import { CHANNEL_OPTIONS } from '../../constants';
import { renderGroup } from '../../helpers/render';
import { PageHeader } from '../../components/muxi';

/* ===================================================================
   Channel Drawer — slide-out detail panel
   =================================================================== */
function ChannelDrawer({ channel, onClose, onTest, onDelete, t }) {
  if (!channel) return null;
  const typeInfo = CHANNEL_OPTIONS.find((c) => c.value === channel.type);
  const statusLabel =
    channel.status === 1 ? 'Online' : channel.status === 2 ? 'Disabled' : channel.status === 3 ? 'Degraded' : 'Unknown';
  const statusClass =
    channel.status === 1 ? 'online' : channel.status === 2 ? 'disabled' : channel.status === 3 ? 'offline' : 'disabled';

  return (
    <>
      <div className='muxi-drawer-overlay' onClick={onClose} />
      <div className='muxi-drawer'>
        <div className='muxi-drawer-header'>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div className='muxi-channel-card-logo' style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
              {(channel.name || '?')[0].toUpperCase()}
            </div>
            <div>
              <div className='muxi-drawer-title'>{channel.name}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {typeInfo?.text || `Type ${channel.type}`}
              </div>
            </div>
          </div>
          <button className='muxi-drawer-close' onClick={onClose} aria-label='Close'>
            <Icon name='close' />
          </button>
        </div>

        <div className='muxi-drawer-body'>
          <div className='muxi-drawer-section'>
            <div className='muxi-drawer-section-label'>Status</div>
            <div className='muxi-drawer-field'>
              <span className='muxi-drawer-field-label'>Status</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600 }}>
                <span className={`muxi-status-dot ${statusClass}`} />
                {statusLabel}
              </span>
            </div>
            <div className='muxi-drawer-field'>
              <span className='muxi-drawer-field-label'>Group</span>
              <span className='muxi-drawer-field-value'>{renderGroup(channel.group)}</span>
            </div>
            <div className='muxi-drawer-field'>
              <span className='muxi-drawer-field-label'>Priority</span>
              <span className='muxi-drawer-field-value'>{channel.priority ?? '—'}</span>
            </div>
          </div>

          <div className='muxi-drawer-section'>
            <div className='muxi-drawer-section-label'>Performance</div>
            <div className='muxi-drawer-field'>
              <span className='muxi-drawer-field-label'>Response Time</span>
              <span className='muxi-drawer-field-value'>
                {channel.response_time ? `${(channel.response_time / 1000).toFixed(2)}s` : 'Not tested'}
              </span>
            </div>
            <div className='muxi-drawer-field'>
              <span className='muxi-drawer-field-label'>Last Tested</span>
              <span className='muxi-drawer-field-value'>
                {channel.test_time ? timestamp2string(channel.test_time) : '—'}
              </span>
            </div>
            <div className='muxi-drawer-field'>
              <span className='muxi-drawer-field-label'>Balance</span>
              <span className='muxi-drawer-field-value'>
                {channel.balance !== undefined ? `$${channel.balance.toFixed(2)}` : '—'}
              </span>
            </div>
          </div>

          {channel.models && channel.models.length > 0 && (
            <div className='muxi-drawer-section'>
              <div className='muxi-drawer-section-label'>Models ({channel.models.length})</div>
              <div className='muxi-drawer-models'>
                {channel.models.slice(0, 20).map((m) => (
                  <span key={m} className='muxi-drawer-model-tag'>{m}</span>
                ))}
                {channel.models.length > 20 && (
                  <span className='muxi-drawer-model-tag'>+{channel.models.length - 20} more</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className='muxi-drawer-footer'>
          <Button className='muxi-btn-accent' fluid onClick={() => onTest(channel)}>
            <Icon name='play' /> Test Channel
          </Button>
          <Button as={Link} to={`/channel/edit/${channel.id}`} className='muxi-btn-ghost'>
            <Icon name='edit' /> Edit
          </Button>
          <Button color='red' basic onClick={() => onDelete(channel)}>Delete</Button>
        </div>
      </div>
    </>
  );
}

/* ===================================================================
   Channel Card
   =================================================================== */
function ChannelCard({ channel, onClick, onTest }) {
  const typeInfo = CHANNEL_OPTIONS.find((c) => c.value === channel.type);
  const statusClass = channel.status === 1 ? 'online' : channel.status === 2 ? 'disabled' : channel.status === 3 ? 'offline' : 'disabled';
  const responseTime = channel.response_time ? (channel.response_time / 1000).toFixed(2) + 's' : '—';
  const rtClass = !channel.response_time ? 'timeout' : channel.response_time <= 1000 ? 'fast' : channel.response_time <= 3000 ? 'slow' : 'timeout';

  return (
    <div className='muxi-channel-card' onClick={onClick}>
      <div className='muxi-channel-card-header'>
        <div className='muxi-channel-card-provider'>
          <div className='muxi-channel-card-logo' style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            {(channel.name || '?')[0].toUpperCase()}
          </div>
          <div>
            <div className='muxi-channel-card-name'>{channel.name || 'Unnamed'}</div>
            <div className='muxi-channel-card-type'>{typeInfo?.text || `Type ${channel.type}`}</div>
          </div>
        </div>
        <span className={`muxi-status-dot ${statusClass}`} />
      </div>
      <div className='muxi-channel-card-metrics'>
        <div className='muxi-channel-metric'>
          <span className='muxi-channel-metric-label'>Latency</span>
          <span className={`muxi-channel-metric-value ${rtClass}`}>{responseTime}</span>
        </div>
        <div className='muxi-channel-metric'>
          <span className='muxi-channel-metric-label'>Balance</span>
          <span className='muxi-channel-metric-value'>{channel.balance !== undefined ? `$${channel.balance.toFixed(2)}` : '—'}</span>
        </div>
        <div className='muxi-channel-metric'>
          <span className='muxi-channel-metric-label'>Group</span>
          <span className='muxi-channel-metric-value'>{renderGroup(channel.group)}</span>
        </div>
        <div className='muxi-channel-metric'>
          <span className='muxi-channel-metric-label'>Models</span>
          <span className='muxi-channel-metric-value'>{channel.models?.length || 0}</span>
        </div>
      </div>
      <div className='muxi-channel-card-actions' onClick={(e) => e.stopPropagation()}>
        <Button className='primary' size='tiny' onClick={() => onTest(channel)}>
          <Icon name='play' />Test
        </Button>
        <Button as={Link} to={`/channel/edit/${channel.id}`} size='tiny'>
          <Icon name='edit' />Edit
        </Button>
      </div>
    </div>
  );
}

/* ===================================================================
   Channel Page
   =================================================================== */
const ChannelPage = () => {
  const { t } = useTranslation();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedChannel, setSelectedChannel] = useState(null);

  const loadChannels = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/channel/?p=0');
      const { success, message, data } = res.data;
      if (success) {
        const list = (data || []).map((ch) => ({
          ...ch,
          models: ch.models ? ch.models.split(',') : [],
          test_model: ch.models ? ch.models.split(',')[0] : '',
        }));
        setChannels(list);
      } else { showError(message); }
    } catch (err) { showError(err.message); }
    setLoading(false);
  };

  useEffect(() => { loadChannels(); }, []);

  const handleTest = async (channel) => {
    const model = channel.test_model || channel.models?.[0];
    if (!model) { showError('No model available for testing'); return; }
    showInfo(`Testing ${channel.name}...`);
    try {
      const res = await API.get(`/api/channel/test/${channel.id}?model=${model}`);
      const { success, message, time } = res.data;
      if (success) { showSuccess(`${channel.name}: ${time.toFixed(2)}s — OK`); loadChannels(); }
      else { showError(message); }
    } catch (err) { showError(err.message); }
  };

  const handleDelete = async (channel) => {
    if (!window.confirm(`Delete channel "${channel.name}"?`)) return;
    try {
      const res = await API.delete(`/api/channel/${channel.id}/`);
      if (res.data.success) { showSuccess('Channel deleted'); setSelectedChannel(null); loadChannels(); }
      else { showError(res.data.message); }
    } catch (err) { showError(err.message); }
  };

  const filtered = search
    ? channels.filter((c) => {
        const kw = search.toLowerCase();
        return (c.name || '').toLowerCase().includes(kw) || String(c.id).includes(kw) || (c.models || []).some((m) => m.toLowerCase().includes(kw));
      })
    : channels;

  const onlineCount = channels.filter((c) => c.status === 1).length;
  const errorCount = channels.filter((c) => c.status === 2 || c.status === 3).length;
  const avgLatency = channels.filter((c) => c.response_time > 0).length > 0
    ? (channels.filter((c) => c.response_time > 0).reduce((s, c) => s + c.response_time, 0) / 1000 / channels.filter((c) => c.response_time > 0).length).toFixed(2) + 's'
    : '—';

  return (
    <div className='muxi-animate-in'>
      <PageHeader
        title={t('channel.manage')}
        description='Manage your AI model providers and monitor channel health.'
        actions={
          <>
            <Button as={Link} to='/channel/add' className='muxi-btn-accent'>
              <Icon name='plus' /> Add Channel
            </Button>
            <Button className='muxi-btn-ghost' onClick={loadChannels} loading={loading}>
              <Icon name='refresh' /> Refresh
            </Button>
          </>
        }
      />

      {/* Stat Bar */}
      <div className='muxi-stat-bar'>
        <div className='muxi-stat-bar-item'>
          <span className='muxi-stat-bar-label'>Total Channels</span>
          <span className='muxi-stat-bar-value'>{channels.length}</span>
        </div>
        <div className='muxi-stat-bar-item'>
          <span className='muxi-stat-bar-label'>Online</span>
          <span className='muxi-stat-bar-value success'>{onlineCount}</span>
        </div>
        <div className='muxi-stat-bar-item'>
          <span className='muxi-stat-bar-label'>Errors / Disabled</span>
          <span className='muxi-stat-bar-value danger'>{errorCount}</span>
        </div>
        <div className='muxi-stat-bar-item'>
          <span className='muxi-stat-bar-label'>Avg Latency</span>
          <span className='muxi-stat-bar-value'>{avgLatency}</span>
        </div>
      </div>

      {/* Search */}
      <div className='muxi-search'>
        <Icon name='search' className='muxi-search-icon' />
        <input type='text' placeholder='Search channels…' value={search} onChange={(e) => setSearch(e.target.value)} />
        <span className='muxi-search-hint'>⌘K</span>
      </div>

      {/* Channel Cards */}
      {loading ? (
        <div className='muxi-channel-grid'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='muxi-skeleton' style={{ height: 180, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <Icon name='sitemap' style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block', opacity: 0.3 }} />
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No channels found</h3>
          <p>{search ? 'Try a different search term.' : 'Add your first AI provider channel to get started.'}</p>
        </div>
      ) : (
        <div className='muxi-channel-grid'>
          {filtered.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} onClick={() => setSelectedChannel(channel)} onTest={handleTest} />
          ))}
        </div>
      )}

      {/* Drawer */}
      <ChannelDrawer channel={selectedChannel} onClose={() => setSelectedChannel(null)} onTest={handleTest} onDelete={handleDelete} t={t} />
    </div>
  );
};

export default ChannelPage;

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Button, Pagination, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { API, showError, showSuccess } from '../../helpers';
import { ITEMS_PER_PAGE } from '../../constants';
import { renderGroup, renderNumber, renderQuota } from '../../helpers/render';

const ROLE_MAP = { 1: 'User', 10: 'Admin', 100: 'Super Admin' };

function UserCard({ user, onManage, idx, t }) {
  const statusClass = user.status === 1 ? 'online' : 'disabled';
  const role = ROLE_MAP[user.role] || 'Unknown';

  return (
    <div className='muxi-channel-card'>
      <div className='muxi-channel-card-header'>
        <div className='muxi-channel-card-provider'>
          <div className='muxi-channel-card-logo' style={{ background: user.role >= 100 ? 'var(--warning-soft)' : user.role >= 10 ? 'var(--accent-soft)' : 'var(--bg-card-hover)', color: user.role >= 100 ? 'var(--warning)' : user.role >= 10 ? 'var(--accent)' : 'var(--text-secondary)' }}>
            {(user.username || '?')[0].toUpperCase()}
          </div>
          <div>
            <div className='muxi-channel-card-name'>{user.username}</div>
            <div className='muxi-channel-card-type'>
              {user.display_name ? `${user.display_name} · ` : ''}{role}
            </div>
          </div>
        </div>
        <span className={`muxi-status-dot ${statusClass}`} title={user.status === 1 ? 'Active' : 'Banned'} />
      </div>
      <div className='muxi-channel-card-metrics'>
        <div className='muxi-channel-metric'>
          <span className='muxi-channel-metric-label'>Quota</span>
          <span className='muxi-channel-metric-value'>{renderQuota(user.quota, t)}</span>
        </div>
        <div className='muxi-channel-metric'>
          <span className='muxi-channel-metric-label'>Used</span>
          <span className='muxi-channel-metric-value'>{renderQuota(user.used_quota, t)}</span>
        </div>
        <div className='muxi-channel-metric'>
          <span className='muxi-channel-metric-label'>Requests</span>
          <span className='muxi-channel-metric-value'>{renderNumber(user.request_count)}</span>
        </div>
        <div className='muxi-channel-metric'>
          <span className='muxi-channel-metric-label'>Group</span>
          <span className='muxi-channel-metric-value'>{renderGroup(user.group)}</span>
        </div>
      </div>
      <div className='muxi-channel-card-actions' onClick={(e) => e.stopPropagation()}>
        <Button as={Link} to={`/user/edit/${user.id}`} size='tiny'><Icon name='edit' />Edit</Button>
        <Button size='tiny' onClick={() => onManage(user.username, user.status === 1 ? 'disable' : 'enable', idx)}>
          {user.status === 1 ? 'Disable' : 'Enable'}
        </Button>
        <Popup trigger={<Button size='tiny' color='red' basic><Icon name='trash' />Delete</Button>} on='click' flowing hoverable>
          <Button size='tiny' negative onClick={() => onManage(user.username, 'delete', idx)}>Confirm Delete {user.username}</Button>
        </Popup>
      </div>
    </div>
  );
}

const User = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activePage, setActivePage] = useState(1);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/api/user/?p=0`);
      if (res.data.success) setUsers(res.data.data || []);
      else showError(res.data.message);
    } catch (err) { showError(err.message); }
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const manageUser = async (username, action, idx) => {
    try {
      const res = await API.post('/api/user/manage', { username, action });
      if (res.data.success) {
        showSuccess('Operation successful');
        const updated = res.data.data;
        if (action === 'delete') {
          setUsers((prev) => prev.filter((u) => u.username !== username));
        } else if (updated) {
          setUsers((prev) => prev.map((u) => (u.username === username ? { ...u, ...updated } : u)));
        }
      } else showError(res.data.message);
    } catch (err) { showError(err.message); }
  };

  const filtered = search
    ? users.filter((u) => (u.username || '').toLowerCase().includes(search.toLowerCase()) || (u.display_name || '').toLowerCase().includes(search.toLowerCase()))
    : users;

  const paged = filtered.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);
  const activeCount = users.filter((u) => u.status === 1).length;
  const adminCount = users.filter((u) => u.role >= 10).length;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) + (filtered.length % ITEMS_PER_PAGE === 0 ? 1 : 0);

  return (
    <div className='muxi-animate-in'>
      <h1 className='muxi-page-title'>{t('user.title')}</h1>
      <p className='muxi-page-subtitle'>Manage user accounts, roles, and access control.</p>

      <div className='muxi-stat-bar'>
        <div className='muxi-stat-bar-item'><span className='muxi-stat-bar-label'>Total Users</span><span className='muxi-stat-bar-value'>{users.length}</span></div>
        <div className='muxi-stat-bar-item'><span className='muxi-stat-bar-label'>Active</span><span className='muxi-stat-bar-value success'>{activeCount}</span></div>
        <div className='muxi-stat-bar-item'><span className='muxi-stat-bar-label'>Admins</span><span className='muxi-stat-bar-value warning'>{adminCount}</span></div>
        <div className='muxi-stat-bar-item'><span className='muxi-stat-bar-label'>Banned</span><span className='muxi-stat-bar-value danger'>{users.length - activeCount}</span></div>
      </div>

      <div className='muxi-search'>
        <Icon name='search' className='muxi-search-icon' />
        <input type='text' placeholder='Search users…' value={search} onChange={(e) => { setSearch(e.target.value); setActivePage(1); }} />
        <span className='muxi-search-hint'>⌘K</span>
      </div>

      <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.5rem' }}>
        <Button as={Link} to='/user/add' className='muxi-btn-accent'><Icon name='plus' /> Add User</Button>
        <Button className='muxi-btn-ghost' onClick={loadUsers} loading={loading}><Icon name='refresh' /> Refresh</Button>
      </div>

      {loading ? (
        <div className='muxi-channel-grid'>
          {[1, 2, 3, 4].map((i) => <div key={i} className='muxi-skeleton' style={{ height: 200, borderRadius: 'var(--radius-lg)' }} />)}
        </div>
      ) : paged.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <Icon name='user' style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block', opacity: 0.3 }} />
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No users found</h3>
          <p>{search ? 'Try a different search.' : 'Add users to manage API access.'}</p>
        </div>
      ) : (
        <>
          <div className='muxi-channel-grid'>
            {paged.map((user, idx) => <UserCard key={user.id} user={user} idx={idx} onManage={manageUser} t={t} />)}
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

export default User;

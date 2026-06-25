import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from 'semantic-ui-react';
import { UserContext } from '../../context/User';
import { isAdmin } from '../../helpers';
import { flattenNavItems, NAV_GROUPS } from '../../constants/nav';

const CommandPalette = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userState] = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const hasChat = !!localStorage.getItem('chat_link');

  const allItems = useMemo(
    () =>
      flattenNavItems(NAV_GROUPS, {
        t,
        isAdmin,
        isLoggedIn: !!userState.user,
        hasChat,
      }),
    [t, userState.user, hasChat]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.groupLabel.toLowerCase().includes(q) ||
        item.to.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const selectItem = useCallback(
    (item) => {
      if (!item) return;
      close();
      navigate(item.to);
    },
    [close, navigate]
  );

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }
      if (!open) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        selectItem(filtered[activeIndex]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, close, filtered, activeIndex, selectItem]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className='muxi-cmd-overlay' role='presentation' onClick={close}>
      <div
        className='muxi-cmd'
        role='dialog'
        aria-modal='true'
        aria-label={t('nav.command_palette')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='muxi-cmd-input-wrap'>
          <Icon name='search' aria-hidden='true' />
          <input
            ref={inputRef}
            type='search'
            className='muxi-cmd-input'
            placeholder={t('nav.command_placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete='off'
            spellCheck={false}
            aria-controls='muxi-cmd-list'
            aria-activedescendant={
              filtered[activeIndex] ? `muxi-cmd-item-${activeIndex}` : undefined
            }
          />
          <kbd className='muxi-cmd-kbd'>Esc</kbd>
        </div>
        <ul id='muxi-cmd-list' className='muxi-cmd-list' role='listbox'>
          {filtered.length === 0 ? (
            <li className='muxi-cmd-empty'>{t('nav.command_empty')}</li>
          ) : (
            filtered.map((item, index) => (
              <li key={item.to + item.name} role='presentation'>
                <button
                  id={`muxi-cmd-item-${index}`}
                  type='button'
                  role='option'
                  aria-selected={index === activeIndex}
                  className={`muxi-cmd-item${index === activeIndex ? ' active' : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectItem(item)}
                >
                  <Icon name={item.icon} aria-hidden='true' />
                  <span className='muxi-cmd-item-label'>{item.label}</span>
                  <span className='muxi-cmd-item-group'>{item.groupLabel}</span>
                </button>
              </li>
            ))
          )}
        </ul>
        <div className='muxi-cmd-footer'>
          <span><kbd>↑</kbd><kbd>↓</kbd> {t('nav.command_navigate')}</span>
          <span><kbd>↵</kbd> {t('nav.command_open')}</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

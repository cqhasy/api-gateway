export const NAV_GROUPS = [
  {
    labelKey: 'nav.overview',
    items: [
      { name: 'header.home', to: '/', icon: 'home' },
      { name: 'header.dashboard', to: '/dashboard', icon: 'chart bar', auth: true },
    ],
  },
  {
    labelKey: 'nav.api_keys',
    items: [{ name: 'header.token', to: '/token', icon: 'key', auth: true }],
  },
  {
    labelKey: 'nav.infrastructure',
    admin: true,
    items: [{ name: 'header.channel', to: '/channel', icon: 'sitemap', admin: true }],
  },
  {
    labelKey: 'nav.billing',
    items: [
      { name: 'header.topup', to: '/topup', icon: 'cart', auth: true },
      { name: 'header.redemption', to: '/redemption', icon: 'dollar sign', admin: true },
    ],
  },
  {
    labelKey: 'nav.observability',
    items: [{ name: 'header.log', to: '/log', icon: 'book', auth: true }],
  },
  {
    labelKey: 'nav.administration',
    admin: true,
    items: [
      { name: 'header.user', to: '/user', icon: 'user', admin: true },
      { name: 'header.setting', to: '/setting', icon: 'setting', auth: true },
    ],
  },
  {
    labelKey: 'nav.system',
    items: [
      { name: 'header.about', to: '/about', icon: 'info circle' },
      { name: 'header.chat', to: '/chat', icon: 'comments', chatOnly: true },
    ],
  },
];

export function flattenNavItems(groups, { t, isAdmin, isLoggedIn, hasChat }) {
  const items = [];
  for (const group of groups) {
    if (group.admin && !isAdmin()) continue;
    for (const item of group.items) {
      if (item.admin && !isAdmin()) continue;
      if (item.auth && !isLoggedIn) continue;
      if (item.chatOnly && !hasChat) continue;
      items.push({
        ...item,
        groupLabel: t(group.labelKey),
        label: t(item.name),
      });
    }
  }
  return items;
}

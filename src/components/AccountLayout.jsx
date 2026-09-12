import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const TruckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="1.5" y="7" width="13" height="9" rx="1.2" />
    <path d="M14.5 10.5H18.5L21.5 13.5V16H14.5Z" />
    <circle cx="6" cy="18.2" r="1.6" />
    <circle cx="17.5" cy="18.2" r="1.6" />
  </svg>
);

const PinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 21s-6.5-5.7-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.3-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 20.5s-7.5-4.6-10-9.3C.6 8 2 4.5 5.4 3.6 8 2.9 10 4 12 6.2 14 4 16 2.9 18.6 3.6 22 4.5 23.4 8 22 11.2c-2.5 4.7-10 9.3-10 9.3Z" />
  </svg>
);

const AccountLayout = () => {
  const { t } = useTranslation();

  const items = [
    { to: '/account', end: true, icon: <UserIcon />, label: t('account.nav_info') },
    { to: '/account/security', end: false, icon: <LockIcon />, label: t('account.nav_security') },
    { to: '/orders', end: false, icon: <TruckIcon />, label: t('nav.orders') },
    { to: '/account/address', end: false, icon: <PinIcon />, label: t('account.nav_address') },
    { to: '/wishlist', end: false, icon: <HeartIcon />, label: t('nav.wishlist') },
  ];

  return (
    <div className="container account-page">
      <aside className="account-sidebar card">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'active' : '')}>
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </aside>
      <div className="account-content card">
        <Outlet />
      </div>
    </div>
  );
};

export default AccountLayout;

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="container navbar">
      <Link to="/" className="logo">
        <img src="/logo-colored.svg" alt={t('brand')} />
        <span>{t('brand')}</span>
      </Link>
      <nav className="navbar-links">
        <Link to="/">{t('nav.home')}</Link>
        <Link to="/shop">{t('nav.shop')}</Link>
        <Link to="/cart">{t('nav.cart')} ({itemCount})</Link>
        {user ? (
          <>
            <Link to="/orders">{t('nav.orders')}</Link>
            <button className="btn btn-outline" onClick={logout}>
              {t('nav.logout')}
            </button>
          </>
        ) : (
          <Link to="/login">{t('nav.login')}</Link>
        )}
        <LanguageSwitcher />
      </nav>
    </header>
  );
};

export default Navbar;

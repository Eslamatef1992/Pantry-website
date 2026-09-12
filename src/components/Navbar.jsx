import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import LanguageSwitcher from './LanguageSwitcher';

const navLinkClass = ({ isActive }) => (isActive ? 'active' : '');

const Navbar = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <header className="container navbar">
      <Link to="/" className="logo">
        <img src="/logo-colored.svg" alt={t('brand')} />
        <span>{t('brand')}</span>
      </Link>

      <nav className="navbar-links">
        <NavLink to="/" end className={navLinkClass}>
          {t('nav.home')}
        </NavLink>
        <NavLink to="/shop" className={navLinkClass}>
          {t('nav.categories')}
        </NavLink>
        <NavLink to="/brands" className={navLinkClass}>
          {t('nav.brands')}
        </NavLink>
        <NavLink to="/page/about-us" className={navLinkClass}>
          {t('nav.about')}
        </NavLink>
        <NavLink to="/page/contact-us" className={navLinkClass}>
          {t('nav.contact')}
        </NavLink>
      </nav>

      <div className="navbar-icons">
        <LanguageSwitcher />
        <Link to="/cart" className="icon-btn" aria-label={t('nav.cart')}>
          <svg width="26" height="24" viewBox="0 0 35 32" fill="none">
            <path
              d="M11.2 8.66667H20.8C25.3334 8.66667 25.7867 10.7867 26.0934 13.3733L27.2934 23.3733C27.68 26.6533 26.6667 29.3333 22 29.3333H10.0134C5.33337 29.3333 4.32003 26.6533 4.72003 23.3733L5.92004 13.3733C6.21338 10.7867 6.6667 8.66667 11.2 8.66667Z"
              stroke="#292D32"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.6667 10.6667V6C10.6667 4 12.0001 2.66667 14.0001 2.66667H18.0001C20.0001 2.66667 21.3334 4 21.3334 6V10.6667"
              stroke="#292D32"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M27.2134 22.7064H10.6667" stroke="#292D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {itemCount > 0 && <span className="icon-badge">{itemCount}</span>}
        </Link>
        <Link to="/wishlist" className="icon-btn" aria-label={t('nav.wishlist')}>
          <svg width="27" height="24" viewBox="0 0 37 32" fill="none">
            <path
              d="M16.8267 27.7467C16.3734 27.9067 15.6267 27.9067 15.1734 27.7467C11.3067 26.4267 2.66675 20.92 2.66675 11.5867C2.66675 7.46667 5.98675 4.13334 10.0801 4.13334C12.5067 4.13334 14.6534 5.30667 16.0001 7.12C17.3467 5.30667 19.5067 4.13334 21.9201 4.13334C26.0134 4.13334 29.3334 7.46667 29.3334 11.5867C29.3334 20.92 20.6934 26.4267 16.8267 27.7467Z"
              stroke="#292D32"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {wishlistCount > 0 && <span className="icon-badge">{wishlistCount}</span>}
        </Link>
        <Link to={user ? '/orders' : '/login'} className="icon-btn" aria-label={t('nav.account')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#292D32" strokeWidth="1.8">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
          </svg>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;

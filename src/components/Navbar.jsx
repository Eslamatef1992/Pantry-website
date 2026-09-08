import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="container navbar">
      <Link to="/" className="logo">
        <img src="/logo-colored.svg" alt={t('brand')} />
        <span>{t('brand')}</span>
      </Link>

      <nav className="navbar-links">
        <Link to="/">{t('nav.home')}</Link>
        <Link to="/shop">{t('nav.categories')}</Link>
        <Link to="/shop">{t('nav.shop')}</Link>
      </nav>

      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search_placeholder')}
        />
        <button type="submit">{t('nav.search')}</button>
      </form>

      <div className="navbar-icons">
        <LanguageSwitcher />
        <Link to="/cart" className="icon-btn" aria-label={t('nav.cart')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 8h16l-1.5 11.2a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8L4 8Z" />
            <path d="M8 8V6a4 4 0 0 1 8 0v2" />
          </svg>
          {itemCount > 0 && <span className="icon-badge">{itemCount}</span>}
        </Link>
        <Link to={user ? '/orders' : '/login'} className="icon-btn" aria-label={t('nav.account')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
          </svg>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;

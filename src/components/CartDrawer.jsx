import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const BagIcon = () => (
  <svg width="46" height="46" viewBox="0 0 35 32" fill="none">
    <path
      d="M11.2 8.66667H20.8C25.3334 8.66667 25.7867 10.7867 26.0934 13.3733L27.2934 23.3733C27.68 26.6533 26.6667 29.3333 22 29.3333H10.0134C5.33337 29.3333 4.32003 26.6533 4.72003 23.3733L5.92004 13.3733C6.21338 10.7867 6.6667 8.66667 11.2 8.66667Z"
      stroke="var(--color-primary-dark)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.6667 10.6667V6C10.6667 4 12.0001 2.66667 14.0001 2.66667H18.0001C20.0001 2.66667 21.3334 4 21.3334 6V10.6667"
      stroke="var(--color-primary-dark)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M27.2134 22.7064H10.6667" stroke="var(--color-primary-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const CartDrawer = () => {
  const { t, i18n } = useTranslation();
  const { cart, isDrawerOpen, closeCart, updateItem, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAr = i18n.language === 'ar';

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeCart]);

  const goCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const goShop = () => {
    closeCart();
    navigate('/shop');
  };

  return (
    <>
      <div className={`cart-drawer-backdrop ${isDrawerOpen ? 'open' : ''}`} onClick={closeCart} />
      <aside className={`cart-drawer ${isDrawerOpen ? 'open' : ''}`} aria-hidden={!isDrawerOpen}>
        <div className="cart-drawer-header">
          <button type="button" className="cart-drawer-close" onClick={closeCart} aria-label="Close">
            <CloseIcon />
          </button>
          <h2>{t('cart.drawer_title')}</h2>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer-body cart-drawer-empty">
            <span className="cart-drawer-empty-icon">
              <BagIcon />
            </span>
            <strong>{t('cart.empty')}</strong>
            <button type="button" className="cart-drawer-btn" onClick={goShop}>
              {t('cart.continue_shopping')}
            </button>
            <div className="cart-drawer-divider" />
            <p className="cart-drawer-signin">
              {t('cart.have_account')}
              <br />
              {!user ? (
                <Link to="/login" onClick={closeCart}>
                  {t('auth.sign_in')}
                </Link>
              ) : null}{' '}
              {t('cart.sign_in_faster')}
            </p>
          </div>
        ) : (
          <>
            <div className="cart-drawer-body">
              {items.map((item) => (
                <div className="cart-drawer-row" key={item.id}>
                  <img src={item.product.image || '/placeholder.svg'} alt="" />
                  <div className="cart-drawer-row-info">
                    <strong>{isAr ? item.product.nameAr : item.product.nameEn}</strong>
                    <span className="cart-drawer-row-price">{Number(item.product.price).toFixed(3)} KWD</span>
                    <div className="cart-drawer-qty">
                      <button type="button" onClick={() => updateItem(item.id, item.quantity - 1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateItem(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                  <button type="button" className="cart-drawer-remove" onClick={() => removeItem(item.id)} aria-label={t('cart.remove')}>
                    <CloseIcon />
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-drawer-footer">
              <div className="cart-drawer-subtotal">
                <span>{t('cart.subtotal')}</span>
                <strong>{subtotal.toFixed(3)} KWD</strong>
              </div>
              <button type="button" className="cart-drawer-btn cart-drawer-btn-block" onClick={goCheckout}>
                {t('cart.checkout')}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;

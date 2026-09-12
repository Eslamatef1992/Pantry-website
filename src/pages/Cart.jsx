import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { t, i18n } = useTranslation();
  const { cart, updateItem, removeItem } = useCart();
  const navigate = useNavigate();
  const isAr = i18n.language === 'ar';

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);

  if (!items.length) {
    return (
      <div className="container" style={{ marginTop: 40, textAlign: 'center' }}>
        <p>{t('cart.empty')}</p>
        <Link to="/shop" className="btn">
          {t('cart.continue_shopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: 30, marginBottom: 40 }}>
      <h1>{t('cart.title')}</h1>
      <div className="grid cart-grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 30, alignItems: 'start' }}>
        <div className="card" style={{ padding: 16 }}>
          {items.map((item) => (
            <div className="cart-row" key={item.id}>
              <img src={item.product.image || '/placeholder.svg'} alt="" />
              <div style={{ flex: 1 }}>
                <strong>{isAr ? item.product.nameAr : item.product.nameEn}</strong>
                <div>{Number(item.product.price).toFixed(3)} KWD</div>
              </div>
              <input
                type="number"
                min="0"
                value={item.quantity}
                style={{ width: 60 }}
                onChange={(e) => updateItem(item.id, Number(e.target.value))}
              />
              <button className="btn btn-outline" onClick={() => removeItem(item.id)}>
                {t('cart.remove')}
              </button>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div className="summary-row">
            <span>{t('cart.subtotal')}</span>
            <span>{subtotal.toFixed(3)} KWD</span>
          </div>
          <button className="btn" style={{ width: '100%', marginTop: 12 }} onClick={() => navigate('/checkout')}>
            {t('cart.checkout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

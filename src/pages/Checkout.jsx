import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const emptyAddress = {
  fullName: '',
  phone: '',
  governorate: '',
  area: '',
  block: '',
  street: '',
  building: '',
  floorApartment: '',
};

const Checkout = () => {
  const { t } = useTranslation();
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(emptyAddress);
  const [methods, setMethods] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    api.get('/settings/payment-methods').then((res) => {
      setMethods(res.data);
      if (res.data.length) setPaymentMethod(res.data[0].method);
    });
  }, []);

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);
  const deliveryFee = 1.5;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const addressRes = await api.post('/addresses', address);
      const orderRes = await api.post('/orders', {
        addressId: addressRes.data.id,
        paymentMethod,
        notes,
      });
      setPlacedOrder(orderRes.data);
      await refreshCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (placedOrder) {
    return (
      <div className="container" style={{ marginTop: 40, textAlign: 'center' }}>
        <h1>{t('checkout.order_placed')}</h1>
        <p>
          {t('checkout.order_number')}: <strong>{placedOrder.orderNumber}</strong>
        </p>
        <button className="btn" onClick={() => navigate('/orders')}>
          {t('nav.orders')}
        </button>
      </div>
    );
  }

  if (!items.length) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container" style={{ marginTop: 30, marginBottom: 40 }}>
      <h1>{t('checkout.title')}</h1>
      <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 30, alignItems: 'start' }}>
        <div className="card" style={{ padding: 20 }}>
          <h3>{t('checkout.address')}</h3>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>{t('checkout.full_name')}</label>
              <input required value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t('checkout.phone')}</label>
              <input required value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t('checkout.governorate')}</label>
              <input value={address.governorate} onChange={(e) => setAddress({ ...address, governorate: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t('checkout.area')}</label>
              <input value={address.area} onChange={(e) => setAddress({ ...address, area: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t('checkout.block')}</label>
              <input value={address.block} onChange={(e) => setAddress({ ...address, block: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t('checkout.street')}</label>
              <input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t('checkout.building')}</label>
              <input value={address.building} onChange={(e) => setAddress({ ...address, building: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t('checkout.floor_apartment')}</label>
              <input
                value={address.floorApartment}
                onChange={(e) => setAddress({ ...address, floorApartment: e.target.value })}
              />
            </div>
          </div>

          <h3>{t('checkout.payment_method')}</h3>
          {methods.map((m) => (
            <label key={m.method} style={{ display: 'block', marginBottom: 8 }}>
              <input
                type="radio"
                name="paymentMethod"
                value={m.method}
                checked={paymentMethod === m.method}
                onChange={() => setPaymentMethod(m.method)}
              />{' '}
              {m.displayNameEn}
            </label>
          ))}
          {!methods.length && <p className="error-text">No payment methods are currently enabled. Please contact us.</p>}

          <div className="form-group">
            <label>{t('checkout.notes')}</label>
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          {error && <p className="error-text">{error}</p>}
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div className="summary-row">
            <span>{t('cart.subtotal')}</span>
            <span>{subtotal.toFixed(3)} KWD</span>
          </div>
          <div className="summary-row">
            <span>{t('cart.delivery')}</span>
            <span>{deliveryFee.toFixed(3)} KWD</span>
          </div>
          <div className="summary-row total">
            <span>{t('cart.total')}</span>
            <span>{total.toFixed(3)} KWD</span>
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: 12 }} disabled={!methods.length}>
            {t('checkout.place_order')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;

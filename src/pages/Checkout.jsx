import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { KUWAIT_GOVERNORATES } from '../data/kuwaitRegions';

const emptyAddress = {
  fullName: '',
  phone: '',
  email: '',
  governorate: '',
  area: '',
  block: '',
  street: '',
  building: '',
  floorApartment: '',
};

const Checkout = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { cart, refreshCart, clearGuestCart, isGuest } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(emptyAddress);
  const [governorateId, setGovernorateId] = useState('');
  const isAr = i18n.language === 'ar';
  const areaOptions = KUWAIT_GOVERNORATES.find((g) => g.id === governorateId)?.areas || [];

  const handleGovernorateChange = (id) => {
    const gov = KUWAIT_GOVERNORATES.find((g) => g.id === id);
    setGovernorateId(id);
    setAddress((prev) => ({ ...prev, governorate: gov ? (isAr ? gov.ar : gov.en) : '', area: '' }));
  };

  const handleAreaChange = (label) => {
    setAddress((prev) => ({ ...prev, area: label }));
  };
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
      if (user) {
        const addressRes = await api.post('/addresses', address);
        const orderRes = await api.post('/orders', {
          addressId: addressRes.data.id,
          paymentMethod,
          notes,
        });
        setPlacedOrder(orderRes.data);
        await refreshCart();
      } else {
        const orderRes = await api.post('/orders/guest', {
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          guestName: address.fullName,
          guestPhone: address.phone,
          guestEmail: address.email,
          address: {
            governorate: address.governorate,
            area: address.area,
            block: address.block,
            street: address.street,
            building: address.building,
            floorApartment: address.floorApartment,
          },
          paymentMethod,
          notes,
        });
        setPlacedOrder(orderRes.data);
        clearGuestCart();
      }
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
        {user ? (
          <button className="btn" onClick={() => navigate('/orders')}>
            {t('nav.orders')}
          </button>
        ) : (
          <Link to="/shop" className="btn">
            {t('cart.continue_shopping')}
          </Link>
        )}
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
      {isGuest && (
        <p style={{ color: '#6b7280', marginBottom: 16 }}>
          {t('checkout.guest_prompt')} <Link to="/login">{t('nav.login')}</Link>
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className="grid checkout-grid"
        style={{ gridTemplateColumns: '2fr 1fr', gap: 30, alignItems: 'start' }}
      >
        <div className="card" style={{ padding: 20 }}>
          <h3>{t('checkout.address')}</h3>
          <div className="grid checkout-address-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>{t('checkout.full_name')}</label>
              <input required value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t('checkout.phone')}</label>
              <input required value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
            </div>
            {isGuest && (
              <div className="form-group">
                <label>{t('checkout.email')}</label>
                <input type="email" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} />
              </div>
            )}
            <div className="form-group">
              <label>{t('checkout.governorate')}</label>
              <select required value={governorateId} onChange={(e) => handleGovernorateChange(e.target.value)}>
                <option value="" disabled>
                  {t('checkout.select_governorate')}
                </option>
                {KUWAIT_GOVERNORATES.map((gov) => (
                  <option key={gov.id} value={gov.id}>
                    {isAr ? gov.ar : gov.en}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t('checkout.area')}</label>
              <select
                required
                value={address.area}
                onChange={(e) => handleAreaChange(e.target.value)}
                disabled={!governorateId}
              >
                <option value="" disabled>
                  {governorateId ? t('checkout.select_area') : t('checkout.select_governorate_first')}
                </option>
                {areaOptions.map((a) => (
                  <option key={a.en} value={isAr ? a.ar : a.en}>
                    {isAr ? a.ar : a.en}
                  </option>
                ))}
              </select>
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

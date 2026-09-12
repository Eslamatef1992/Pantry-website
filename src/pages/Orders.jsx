import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const THUMB_LIMIT = 4;

const Orders = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders')
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  if (!orders.length) {
    return (
      <div className="container" style={{ marginTop: 40, textAlign: 'center' }}>
        <p>{t('orders.empty')}</p>
        <button className="btn btn-outline" onClick={logout}>
          {t('nav.logout')}
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: 30, marginBottom: 40 }}>
      <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{t('orders.title')}</h1>
        <button className="btn btn-outline" onClick={logout}>
          {t('nav.logout')}
        </button>
      </div>
      {orders.map((o) => {
        const items = o.items || [];
        const thumbs = items.slice(0, THUMB_LIMIT);
        const extraCount = items.length - thumbs.length;
        return (
          <Link key={o.id} to={`/orders/${o.id}`} className="card order-card">
            <div className="summary-row">
              <strong>#{o.orderNumber}</strong>
              <span className="badge">{t(`orders.status_${o.status}`, o.status)}</span>
            </div>
            <div className="summary-row">
              <span>{t('orders.placed_on')}</span>
              <span>{new Date(o.createdAt).toLocaleDateString()}</span>
            </div>
            {!!thumbs.length && (
              <div className="order-card-thumbs">
                {thumbs.map((item) => (
                  <img
                    key={item.id}
                    src={item.product?.image || '/placeholder.svg'}
                    alt={item.nameEn}
                    className="order-card-thumb"
                  />
                ))}
                {extraCount > 0 && <span className="order-card-thumb-more">+{extraCount}</span>}
              </div>
            )}
            <div className="summary-row total">
              <span>{t('orders.total')}</span>
              <span>{Number(o.total).toFixed(3)} KWD</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Orders;

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data));
  }, []);

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
      {orders.map((o) => (
        <div key={o.id} className="card" style={{ padding: 16, marginBottom: 12 }}>
          <div className="summary-row">
            <strong>#{o.orderNumber}</strong>
            <span className="badge">{o.status}</span>
          </div>
          <div className="summary-row">
            <span>{t('orders.placed_on')}</span>
            <span>{new Date(o.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="summary-row total">
            <span>{t('orders.total')}</span>
            <span>{Number(o.total).toFixed(3)} KWD</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;

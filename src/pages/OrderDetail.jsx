import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const OrderDetail = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return null;

  if (notFound || !order) {
    return (
      <div className="container" style={{ marginTop: 40, textAlign: 'center' }}>
        <p>{t('orders.not_found')}</p>
        <Link to="/orders" className="btn">
          {t('orders.back_to_orders')}
        </Link>
      </div>
    );
  }

  const shipping = order.shippingSnapshot || {};
  const items = order.items || [];

  return (
    <div className="container" style={{ marginTop: 30, marginBottom: 40 }}>
      <Link to="/orders" className="order-detail-back">
        {isAr ? '→' : '←'} {t('orders.back_to_orders')}
      </Link>

      <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <h1>#{order.orderNumber}</h1>
        <span className="badge">{t(`orders.status_${order.status}`, order.status)}</span>
      </div>
      <p style={{ color: 'var(--color-muted)', marginBottom: 24 }}>
        {t('orders.placed_on')} {new Date(order.createdAt).toLocaleDateString()}
      </p>

      <div className="grid order-detail-grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}>
        <div className="card" style={{ padding: 20 }}>
          <h3>{t('orders.items')}</h3>
          {items.map((item) => (
            <div key={item.id} className="order-detail-item">
              <img src={item.product?.image || '/placeholder.svg'} alt={item.nameEn} />
              <div className="order-detail-item-info">
                <strong>{isAr ? item.nameAr : item.nameEn}</strong>
                <span>
                  {t('orders.qty')}: {item.quantity}
                </span>
              </div>
              <span className="order-detail-item-price">{Number(item.price).toFixed(3)} KWD</span>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3>{t('orders.shipping_address')}</h3>
          <p style={{ color: 'var(--color-muted)', fontSize: 14, lineHeight: 1.6 }}>
            {shipping.fullName}
            <br />
            {shipping.phone}
            <br />
            {[shipping.governorate, shipping.area, shipping.block, shipping.street, shipping.building, shipping.floorApartment]
              .filter(Boolean)
              .join(', ')}
          </p>

          <h3>{t('checkout.payment_method')}</h3>
          <p style={{ color: 'var(--color-muted)', fontSize: 14, marginBottom: 20 }}>
            {order.paymentMethod?.toUpperCase()}
          </p>

          <div className="summary-row">
            <span>{t('cart.subtotal')}</span>
            <span>{Number(order.subtotal).toFixed(3)} KWD</span>
          </div>
          <div className="summary-row">
            <span>{t('cart.delivery')}</span>
            <span>{Number(order.deliveryFee).toFixed(3)} KWD</span>
          </div>
          <div className="summary-row total">
            <span>{t('cart.total')}</span>
            <span>{Number(order.total).toFixed(3)} KWD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

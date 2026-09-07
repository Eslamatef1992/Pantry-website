import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    api.get(`/products/${slug}`).then((res) => setProduct(res.data));
  }, [slug]);

  if (!product) return <div className="container" style={{ marginTop: 30 }}>Loading...</div>;

  const name = isAr ? product.nameAr : product.nameEn;
  const description = isAr ? product.descriptionAr : product.descriptionEn;

  const handleAdd = async () => {
    if (!user) return navigate('/login');
    await addToCart(product.id, qty);
  };

  return (
    <div className="container" style={{ marginTop: 30, marginBottom: 40 }}>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        <img
          src={product.image || '/placeholder.svg'}
          alt={name}
          style={{ width: '100%', borderRadius: 10, background: '#f7f8f6' }}
        />
        <div>
          <h1>{name}</h1>
          <p className="price" style={{ fontSize: 22 }}>
            {Number(product.price).toFixed(3)} KWD
          </p>
          <p>{description}</p>
          <div className="form-group" style={{ maxWidth: 120 }}>
            <label>{t('product.quantity')}</label>
            <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          </div>
          <button className="btn" disabled={product.stock <= 0} onClick={handleAdd}>
            {product.stock > 0 ? t('product.add_to_cart') : t('product.out_of_stock')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

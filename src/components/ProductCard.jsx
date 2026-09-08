import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const isAr = i18n.language === 'ar';
  const name = isAr ? product.nameAr : product.nameEn;

  const hasDiscount = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);
  const discountPct = hasDiscount
    ? Math.round(100 - (Number(product.price) / Number(product.compareAtPrice)) * 100)
    : 0;

  const handleAdd = async (e) => {
    e.preventDefault();
    await addToCart(product, 1);
  };

  return (
    <Link to={`/product/${product.slug}`} className="card product-card">
      <div className="product-card-media">
        <img src={product.image ? product.image : '/placeholder.svg'} alt={name} />
        {hasDiscount && <span className="discount-badge">-{discountPct}%</span>}
      </div>
      <div className="body">
        <strong>{name}</strong>
        <span className="price-row">
          <span className="price">{Number(product.price).toFixed(3)} KWD</span>
          {hasDiscount && <span className="price-compare">{Number(product.compareAtPrice).toFixed(3)}</span>}
        </span>
        <button className="btn" disabled={product.stock <= 0} onClick={handleAdd}>
          {product.stock > 0 ? t('product.add_to_cart') : t('product.out_of_stock')}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;

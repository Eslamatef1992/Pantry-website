import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isAr = i18n.language === 'ar';
  const name = isAr ? product.nameAr : product.nameEn;
  const description = isAr ? product.descriptionAr : product.descriptionEn;
  const shortDescription = description && description.length > 46 ? `${description.slice(0, 46).trim()}...` : description;
  const inWishlist = isInWishlist(product.id);

  const hasDiscount = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);
  const discountPct = hasDiscount
    ? Math.round(100 - (Number(product.price) / Number(product.compareAtPrice)) * 100)
    : 0;

  const badge = product.isBestSeller
    ? { key: 'best_seller', className: 'badge-best-seller' }
    : product.isNewArrival
    ? { key: 'new_arrival', className: 'badge-new-arrival' }
    : product.isBundle
    ? { key: 'bundle', className: 'badge-bundle' }
    : null;

  const handleWishlist = async (e) => {
    e.preventDefault();
    await toggleWishlist(product);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await addToCart(product, 1);
  };

  return (
    <Link to={`/product/${product.slug}`} className="card product-card">
      <div className="product-card-media">
        <img src={product.image ? product.image : '/placeholder.svg'} alt={name} />
        {badge && <span className={`product-badge ${badge.className}`}>{t(`product.${badge.key}`)}</span>}
        <button
          type="button"
          className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
          onClick={handleWishlist}
          aria-label={t('nav.wishlist')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
            <path d="M12 20.5s-7.5-4.6-10-9.3C.6 8 2 4.5 5.4 3.6 8 2.9 10 4 12 6.2 14 4 16 2.9 18.6 3.6 22 4.5 23.4 8 22 11.2c-2.5 4.7-10 9.3-10 9.3Z" />
          </svg>
        </button>
      </div>
      <div className="product-card-divider" />
      <div className="body">
        <strong>{name}</strong>
        {shortDescription && <span className="product-subtitle">{shortDescription}</span>}
        <span className="price-row">
          <span className="price">{Number(product.price).toFixed(3)} KWD</span>
        </span>
        {hasDiscount && (
          <span className="price-row">
            <span className="price-compare">{Number(product.compareAtPrice).toFixed(3)}</span>
            <span className="discount-pill">-{discountPct}%</span>
          </span>
        )}
        <button className="btn product-card-add-btn" disabled={product.stock <= 0} onClick={handleAdd}>
          {product.stock > 0 ? t('product.add_to_cart') : t('product.out_of_stock')}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;

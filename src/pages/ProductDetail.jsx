import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const ChevronIcon = ({ open }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const ProductDetail = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(null);
  const [specsOpen, setSpecsOpen] = useState(true);
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    api.get(`/products/${slug}`).then((res) => {
      setProduct(res.data);
      setActiveImage(res.data.image || (res.data.images && res.data.images[0]) || null);
      setQty(1);
    });
  }, [slug]);

  if (!product) return <div className="container" style={{ marginTop: 30 }}>Loading...</div>;

  const name = isAr ? product.nameAr : product.nameEn;
  const description = isAr ? product.descriptionAr : product.descriptionEn;
  const categoryName = product.category ? (isAr ? product.category.nameAr : product.category.nameEn) : null;
  const brandName = product.brand ? (isAr ? product.brand.nameAr : product.brand.nameEn) : null;

  const gallery = product.images && product.images.length ? product.images : product.image ? [product.image] : [];

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

  const inStock = product.stock > 0;

  const handleAdd = async () => {
    await addToCart(product, qty);
  };

  const handleBuyNow = async () => {
    await addToCart(product, qty);
    navigate('/checkout');
  };

  return (
    <div className="container pdp" style={{ marginTop: 24, marginBottom: 50 }}>
      <div className="pdp-breadcrumb">
        <Link to="/">{t('product.home')}</Link>
        {categoryName && (
          <>
            <span>›</span>
            <Link to={`/shop?category=${product.category.slug}`}>{categoryName}</Link>
          </>
        )}
        <span>›</span>
        <span className="pdp-breadcrumb-current">{name}</span>
      </div>

      <div className="pdp-grid">
        <div className="pdp-gallery">
          <div className="pdp-gallery-main">
            <img src={activeImage || '/placeholder.svg'} alt={name} />
            {hasDiscount && <span className="discount-pill pdp-discount-pill">-{discountPct}%</span>}
          </div>
          {gallery.length > 1 && (
            <div className="pdp-thumbs">
              {gallery.map((img) => (
                <button
                  key={img}
                  type="button"
                  className={`pdp-thumb ${img === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pdp-info">
          <h1>{name}</h1>

          {badge && (
            <span className={`product-badge ${badge.className}`} style={{ position: 'static', display: 'inline-block' }}>
              {t(`product.${badge.key}`)}
            </span>
          )}

          {brandName && <div className="pdp-brand">{brandName}</div>}

          {product.sku && (
            <div className="pdp-sku">
              {t('product.sku')}: {product.sku}
            </div>
          )}

          <div className="pdp-price-row">
            <span className="pdp-price">{Number(product.price).toFixed(3)} KWD</span>
            {hasDiscount && (
              <>
                <span className="price-compare">{Number(product.compareAtPrice).toFixed(3)} KWD</span>
                <span className="discount-pill">-{discountPct}%</span>
              </>
            )}
          </div>

          <div className="pdp-divider" />

          <div className={`pdp-availability ${inStock ? 'in-stock' : 'out-of-stock'}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5" strokeLinecap="round" />
              <circle cx="12" cy="16" r="0.5" fill="currentColor" />
            </svg>
            {inStock ? t('product.available') : t('product.unavailable')}
          </div>
          {inStock && <div className="pdp-stock-count">{t('product.stock_available', { count: product.stock })}</div>}

          <div className="pdp-qty-row">
            <span>{t('product.quantity')}</span>
            <div className="pdp-qty">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={!inStock}>
                −
              </button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(product.stock, q + 1))} disabled={!inStock}>
                +
              </button>
            </div>
          </div>

          <div className="pdp-actions">
            <button type="button" className="pdp-btn pdp-btn-outline" disabled={!inStock} onClick={handleAdd}>
              {inStock ? t('product.add_to_cart') : t('product.out_of_stock')}
            </button>
            <button type="button" className="pdp-btn pdp-btn-solid" disabled={!inStock} onClick={handleBuyNow}>
              {t('product.buy_now')}
            </button>
          </div>
        </div>
      </div>

      {description && (
        <div className="pdp-accordion">
          <button type="button" className="pdp-accordion-header" onClick={() => setSpecsOpen((o) => !o)}>
            <span>{t('product.specifications')}</span>
            <ChevronIcon open={specsOpen} />
          </button>
          {specsOpen && <div className="pdp-accordion-body">{description}</div>}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

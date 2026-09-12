import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { t } = useTranslation();
  const { wishlist } = useWishlist();
  const items = wishlist.items || [];

  if (!items.length) {
    return (
      <div className="container" style={{ marginTop: 40, textAlign: 'center' }}>
        <p>{t('wishlist.empty')}</p>
        <Link to="/shop" className="btn">
          {t('cart.continue_shopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: 30, marginBottom: 40 }}>
      <h1>{t('wishlist.title')}</h1>
      <div className="grid grid-products">
        {items.map((item) => (
          <ProductCard key={item.productId} product={item.product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;

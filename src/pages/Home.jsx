import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import BannerCarousel from '../components/BannerCarousel';

const ProductSection = ({ titleKey, viewAllHref, products }) => {
  const { t } = useTranslation();
  if (!products.length) return null;
  return (
    <section className="container" style={{ marginTop: 40 }}>
      <div className="section-heading">
        <h2>{t(titleKey)}</h2>
        <Link to={viewAllHref}>{t('home.view_all')} →</Link>
      </div>
      <div className="grid grid-products">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bundles, setBundles] = useState([]);
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    api.get('/banners').then((res) => setBanners(res.data));
    api.get('/categories').then((res) => setCategories(res.data));
    api.get('/products', { params: { onOffer: true, limit: 8 } }).then((res) => setOffers(res.data.products));
    api.get('/products', { params: { bestSeller: true, limit: 8 } }).then((res) => setBestSellers(res.data.products));
    api.get('/products', { params: { newArrival: true, limit: 8 } }).then((res) => setNewArrivals(res.data.products));
    api.get('/products', { params: { bundle: true, limit: 8 } }).then((res) => setBundles(res.data.products));
  }, []);

  return (
    <div>
      {banners.length ? (
        <BannerCarousel banners={banners} />
      ) : (
        <section className="hero">
          <div className="container">
            <h1>{t('home.hero_title')}</h1>
            <p>{t('home.hero_subtitle')}</p>
            <Link to="/shop" className="btn">
              {t('home.shop_now')}
            </Link>
          </div>
        </section>
      )}

      <section className="container" style={{ marginTop: 40 }}>
        <h2>{t('home.categories')}</h2>
        <div className="grid grid-products">
          {categories.map((c) => (
            <Link key={c.id} to={`/shop?category=${c.slug}`} className="card" style={{ padding: 16, textAlign: 'center' }}>
              {isAr ? c.nameAr : c.nameEn}
            </Link>
          ))}
        </div>
      </section>

      <ProductSection titleKey="home.offers" viewAllHref="/shop?onOffer=true" products={offers} />
      <ProductSection titleKey="home.best_sellers" viewAllHref="/shop?bestSeller=true" products={bestSellers} />
      <ProductSection titleKey="home.new_arrivals" viewAllHref="/shop?newArrival=true" products={newArrivals} />
      <ProductSection titleKey="home.bundles" viewAllHref="/shop?bundle=true" products={bundles} />

      <div style={{ marginBottom: 40 }} />
    </div>
  );
};

export default Home;

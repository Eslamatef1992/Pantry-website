import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import BannerCarousel from '../components/BannerCarousel';
import Rail, { RailArrows } from '../components/Rail';

const ProductSection = ({ titleKey, viewAllHref, products }) => {
  const { t } = useTranslation();
  const railRef = useRef(null);
  if (!products.length) return null;
  return (
    <section className="container" style={{ marginTop: 40 }}>
      <div className="section-heading">
        <h2>{t(titleKey)}</h2>
        <div className="section-heading-actions">
          <Link to={viewAllHref}>{t('home.view_all')} →</Link>
          <RailArrows railRef={railRef} />
        </div>
      </div>
      <Rail ref={railRef} className="rail-products">
        {products.map((p) => (
          <div className="rail-item" key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </Rail>
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
  const catRailRef = useRef(null);

  useEffect(() => {
    api.get('/banners').then((res) => setBanners(res.data));
    api.get('/categories', { params: { withCounts: true } }).then((res) => setCategories(res.data));
    api.get('/products', { params: { onOffer: true, limit: 8 } }).then((res) => setOffers(res.data.products));
    api.get('/products', { params: { bestSeller: true, limit: 8 } }).then((res) => setBestSellers(res.data.products));
    api.get('/products', { params: { newArrival: true, limit: 8 } }).then((res) => setNewArrivals(res.data.products));
    api.get('/products', { params: { bundle: true, limit: 8 } }).then((res) => setBundles(res.data.products));
  }, []);

  const renderHero = () => {
    if (banners.length >= 3) {
      const [main, ...rest] = banners;
      const side = rest.slice(0, 2);
      return (
        <div className="container hero-grid">
          <Link to={main.linkUrl || '/shop'} className="hero-main" style={{ backgroundImage: `url(${main.image})` }}>
            {(main.titleEn || main.subtitleEn) && (
              <div className="hero-card-overlay">
                {main.titleEn && <h2>{isAr ? main.titleAr : main.titleEn}</h2>}
                {main.subtitleEn && <p>{isAr ? main.subtitleAr : main.subtitleEn}</p>}
              </div>
            )}
          </Link>
          <div className="hero-side">
            {side.map((b) => (
              <Link key={b.id} to={b.linkUrl || '/shop'} className="hero-side-card" style={{ backgroundImage: `url(${b.image})` }}>
                {b.titleEn && (
                  <div className="hero-card-overlay">
                    <h3>{isAr ? b.titleAr : b.titleEn}</h3>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      );
    }
    if (banners.length) return <BannerCarousel banners={banners} />;
    return (
      <section className="hero">
        <div className="container">
          <h1>{t('home.hero_title')}</h1>
          <p>{t('home.hero_subtitle')}</p>
          <Link to="/shop" className="btn">
            {t('home.shop_now')}
          </Link>
        </div>
      </section>
    );
  };

  return (
    <div>
      {renderHero()}

      <section className="container" style={{ marginTop: 40 }}>
        <div className="section-heading">
          <h2>{t('home.categories')}</h2>
          <div className="section-heading-actions">
            <Link to="/shop">{t('home.view_all')} →</Link>
            <RailArrows railRef={catRailRef} />
          </div>
        </div>
        <Rail ref={catRailRef} className="rail-categories">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/shop?category=${c.slug}`}
              className="category-card"
              style={c.image ? { backgroundImage: `url(${c.image})` } : undefined}
            >
              <span className="category-card-label">
                <strong>{isAr ? c.nameAr : c.nameEn}</strong>
                {typeof c.productCount === 'number' && (
                  <small>{t('home.category_products', { count: c.productCount })}</small>
                )}
              </span>
            </Link>
          ))}
        </Rail>
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

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    api.get('/products', { params: { featured: true, limit: 8 } }).then((res) => setFeatured(res.data.products));
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>{t('home.hero_title')}</h1>
          <p>{t('home.hero_subtitle')}</p>
          <Link to="/shop" className="btn">
            {t('home.shop_now')}
          </Link>
        </div>
      </section>

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

      <section className="container" style={{ marginTop: 40, marginBottom: 40 }}>
        <h2>{t('home.featured')}</h2>
        <div className="grid grid-products">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const Brands = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    api.get('/brands').then((res) => setBrands(res.data));
  }, []);

  if (!brands.length) {
    return (
      <div className="container" style={{ marginTop: 40, textAlign: 'center' }}>
        <p>{t('brands_page.empty')}</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: 30, marginBottom: 40 }}>
      <h1>{t('brands_page.title')}</h1>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
        {brands.map((b) => (
          <Link key={b.id} to={`/shop?brand=${b.slug}`} className="card brand-card">
            <div className="brand-card-media" style={b.image ? { backgroundImage: `url(${b.image})` } : undefined} />
            <span>{isAr ? b.nameAr : b.nameEn}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Brands;

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const PRICE_MIN = 0;
const PRICE_MAX = 50;

const CategoryFilterSidebar = ({ isOpen = false, onClose = () => {} }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const activeCategory = searchParams.get('category') || '';

  const [priceMin, setPriceMin] = useState(
    searchParams.get('minPrice') !== null ? Number(searchParams.get('minPrice')) : PRICE_MIN
  );
  const [priceMax, setPriceMax] = useState(
    searchParams.get('maxPrice') !== null ? Number(searchParams.get('maxPrice')) : PRICE_MAX
  );

  useEffect(() => {
    api.get('/categories', { params: { withCounts: true } }).then((res) => setCategories(res.data));
  }, []);

  const selectCategory = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug) {
      next.set('category', slug);
    } else {
      next.delete('category');
    }
    setSearchParams(next);
    onClose();
  };

  const applyPrice = () => {
    const next = new URLSearchParams(searchParams);
    next.set('minPrice', priceMin);
    next.set('maxPrice', priceMax);
    setSearchParams(next);
    onClose();
  };

  const handleMinChange = (value) => {
    const val = Math.min(Number(value), priceMax - 1);
    setPriceMin(val);
  };

  const handleMaxChange = (value) => {
    const val = Math.max(Number(value), priceMin + 1);
    setPriceMax(val);
  };

  const minPct = ((priceMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPct = ((priceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <>
      {isOpen && <div className="shop-filters-backdrop" onClick={onClose} />}
      <aside className={`shop-filters card${isOpen ? ' open' : ''}`}>
        <div className="shop-filters-mobile-header">
          <h3>{t('shop_filters.filters')}</h3>
          <button type="button" className="shop-filters-close" onClick={onClose} aria-label={t('shop_filters.close')}>
            &times;
          </button>
        </div>
      <div className="shop-filters-section">
        <h3>{t('shop_filters.categories')}</h3>
        <ul className="filter-category-list">
          <li>
            <button type="button" className={!activeCategory ? 'active' : ''} onClick={() => selectCategory('')}>
              <span>{t('shop_filters.all_categories')}</span>
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className={activeCategory === c.slug ? 'active' : ''}
                onClick={() => selectCategory(c.slug)}
              >
                <span>{isAr ? c.nameAr : c.nameEn}</span>
                <span className="filter-category-count">{c.productCount ?? 0}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="shop-filters-section">
        <div className="shop-filters-price-header">
          <h3>
            {t('shop_filters.price')} <span className="shop-filters-price-unit">(KWD)</span>
          </h3>
          <button type="button" className="btn-link" onClick={applyPrice}>
            {t('shop_filters.apply')}
          </button>
        </div>
        <div className="price-range">
          <div className="price-range-rail" />
          <div className="price-range-fill" style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }} />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step="0.5"
            value={priceMin}
            onChange={(e) => handleMinChange(e.target.value)}
            className="price-range-input"
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step="0.5"
            value={priceMax}
            onChange={(e) => handleMaxChange(e.target.value)}
            className="price-range-input"
          />
        </div>
        <div className="price-range-values">
          <span>{priceMin.toFixed(3)} KWD</span>
          <span>{priceMax.toFixed(3)} KWD</span>
        </div>
      </div>
      </aside>
    </>
  );
};

export default CategoryFilterSidebar;

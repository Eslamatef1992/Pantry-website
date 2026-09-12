import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import CategoryFilterSidebar from '../components/CategoryFilterSidebar';

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="6" x2="20" y2="6" />
    <circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
    <line x1="4" y1="18" x2="20" y2="18" />
    <circle cx="11" cy="18" r="2" fill="currentColor" stroke="none" />
  </svg>
);

const ProductList = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const onOffer = searchParams.get('onOffer') === 'true';
  const bestSeller = searchParams.get('bestSeller') === 'true';
  const newArrival = searchParams.get('newArrival') === 'true';
  const bundle = searchParams.get('bundle') === 'true';
  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const [products, setProducts] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const params = useMemo(() => {
    const p = {};
    if (category) p.category = category;
    if (brand) p.brand = brand;
    if (onOffer) p.onOffer = true;
    if (bestSeller) p.bestSeller = true;
    if (newArrival) p.newArrival = true;
    if (bundle) p.bundle = true;
    if (search) p.search = search;
    if (minPrice) p.minPrice = minPrice;
    if (maxPrice) p.maxPrice = maxPrice;
    return p;
  }, [category, brand, onOffer, bestSeller, newArrival, bundle, search, minPrice, maxPrice]);

  useEffect(() => {
    api.get('/products', { params }).then((res) => setProducts(res.data.products));
  }, [params]);

  const heading = search ? `${t('search_results')}: "${search}"` : onOffer
    ? t('home.offers')
    : bestSeller
      ? t('home.best_sellers')
      : newArrival
        ? t('home.new_arrivals')
        : bundle
          ? t('home.bundles')
          : t('nav.shop');

  return (
    <div className="container" style={{ marginTop: 30, marginBottom: 40 }}>
      <h1>{heading}</h1>
      <button type="button" className="shop-filters-toggle" onClick={() => setFiltersOpen(true)}>
        <FilterIcon />
        {t('shop_filters.filters')}
      </button>
      <div className="shop-layout">
        <CategoryFilterSidebar isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} />
        <div className="shop-layout-main">
          {!products.length ? (
            <p>{t('shop_filters.no_results')}</p>
          ) : (
            <div className="grid grid-products">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;

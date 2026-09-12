import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

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
  const [products, setProducts] = useState([]);

  const params = useMemo(() => {
    const p = {};
    if (category) p.category = category;
    if (brand) p.brand = brand;
    if (onOffer) p.onOffer = true;
    if (bestSeller) p.bestSeller = true;
    if (newArrival) p.newArrival = true;
    if (bundle) p.bundle = true;
    if (search) p.search = search;
    return p;
  }, [category, brand, onOffer, bestSeller, newArrival, bundle, search]);

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
      <div className="grid grid-products">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;

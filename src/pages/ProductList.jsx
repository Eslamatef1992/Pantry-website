import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const ProductList = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products', { params: category ? { category } : {} }).then((res) => setProducts(res.data.products));
  }, [category]);

  return (
    <div className="container" style={{ marginTop: 30, marginBottom: 40 }}>
      <h1>{t('nav.shop')}</h1>
      <div className="grid grid-products">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;

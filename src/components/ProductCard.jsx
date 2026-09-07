import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAr = i18n.language === 'ar';
  const name = isAr ? product.nameAr : product.nameEn;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    await addToCart(product.id, 1);
  };

  return (
    <Link to={`/product/${product.slug}`} className="card product-card">
      <img src={product.image ? product.image : '/placeholder.svg'} alt={name} />
      <div className="body">
        <strong>{name}</strong>
        <span className="price">{Number(product.price).toFixed(3)} KWD</span>
        <button className="btn" disabled={product.stock <= 0} onClick={handleAdd}>
          {product.stock > 0 ? t('product.add_to_cart') : t('product.out_of_stock')}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;

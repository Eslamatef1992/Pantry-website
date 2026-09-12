import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import NotFound from './pages/NotFound';
import Wishlist from './pages/Wishlist';
import Brands from './pages/Brands';
import StaticPage from './pages/StaticPage';
import AccountLayout from './components/AccountLayout';
import AccountProfile from './pages/AccountProfile';
import AccountSecurity from './pages/AccountSecurity';
import AccountAddresses from './pages/AccountAddresses';

function App() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ProductList />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/page/:slug" element={<StaticPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <PrivateRoute>
                <OrderDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <AccountLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AccountProfile />} />
            <Route path="security" element={<AccountSecurity />} />
            <Route path="address" element={<AccountAddresses />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;

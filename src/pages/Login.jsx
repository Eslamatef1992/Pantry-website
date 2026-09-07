import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420, marginTop: 60, marginBottom: 60 }}>
      <h1>{t('auth.login_title')}</h1>
      <form onSubmit={handleSubmit} className="card" style={{ padding: 24 }}>
        <div className="form-group">
          <label>{t('auth.email')}</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>{t('auth.password')}</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn" style={{ width: '100%' }}>
          {t('auth.sign_in')}
        </button>
        <p style={{ marginTop: 16, fontSize: 14 }}>
          {t('auth.no_account')} <Link to="/register">{t('auth.sign_up')}</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

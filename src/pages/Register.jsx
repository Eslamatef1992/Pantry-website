import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420, marginTop: 60, marginBottom: 60 }}>
      <h1>{t('auth.register_title')}</h1>
      <form onSubmit={handleSubmit} className="card" style={{ padding: 24 }}>
        <div className="form-group">
          <label>{t('auth.name')}</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>{t('auth.email')}</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label>{t('checkout.phone')}</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="form-group">
          <label>{t('auth.password')}</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn" style={{ width: '100%' }}>
          {t('auth.sign_up')}
        </button>
        <p style={{ marginTop: 16, fontSize: 14 }}>
          {t('auth.have_account')} <Link to="/login">{t('auth.sign_in')}</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

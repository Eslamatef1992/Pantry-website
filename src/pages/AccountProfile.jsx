import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const KuwaitFlag = () => (
  <svg width="22" height="16" viewBox="0 0 32 32" fill="none" style={{ borderRadius: 2, flexShrink: 0 }}>
    <path d="M32 6.66875H0V12.8688H32V6.66875Z" fill="#429976" />
    <path d="M32 12.8688H0V19.1001H32V12.8688Z" fill="white" />
    <path d="M32 19.1001H0V25.3313H32V19.1001Z" fill="#BD1F34" />
    <path d="M0 6.66875V25.3375L9.33125 19.1V12.8688L0.04375 6.66875H0Z" fill="#010101" />
  </svg>
);

const stripCountryCode = (phone) => (phone || '').replace(/^\+?965/, '').trim();

const AccountProfile = () => {
  const { t } = useTranslation();
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [localPhone, setLocalPhone] = useState(stripCountryCode(user?.phone));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const phone = localPhone ? `+965${localPhone.replace(/\s+/g, '')}` : '';
      const res = await api.put('/auth/me', { name, email, phone });
      setUser(res.data.user);
      setSuccess(t('account.saved'));
    } catch (err) {
      setError(err.response?.data?.message || t('account.save_failed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h2>{t('account.personal_info')}</h2>
      <form onSubmit={handleSubmit} className="account-form">
        <div className="form-group">
          <label>
            {t('account.full_name')} <span className="required-mark">*</span>
          </label>
          <input required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>
            {t('account.email')} <span className="required-mark">*</span>
          </label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>
            {t('account.mobile_number')} <span className="required-mark">*</span>
          </label>
          <div className="phone-input">
            <span className="phone-input-prefix">
              <KuwaitFlag />
              965+
            </span>
            <input
              required
              value={localPhone}
              onChange={(e) => setLocalPhone(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength={8}
              inputMode="numeric"
            />
          </div>
        </div>
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
        <button type="submit" className="btn account-save-btn" disabled={saving}>
          {saving ? t('account.saving') : t('account.save')}
        </button>
      </form>
    </>
  );
};

export default AccountProfile;

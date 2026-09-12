import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const AccountSecurity = () => {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError(t('account.password_mismatch'));
      return;
    }
    setSaving(true);
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      setSuccess(t('account.password_updated'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || t('account.save_failed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h2>{t('account.password_security')}</h2>
      <form onSubmit={handleSubmit} className="account-form">
        <div className="form-group">
          <label>{t('account.current_password')}</label>
          <input required type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label>{t('account.new_password')}</label>
          <input required type="password" minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label>{t('account.confirm_password')}</label>
          <input required type="password" minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
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

export default AccountSecurity;

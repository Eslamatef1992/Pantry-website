import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { KUWAIT_GOVERNORATES } from '../data/kuwaitRegions';

const emptyForm = {
  label: '',
  fullName: '',
  phone: '',
  block: '',
  street: '',
  building: '',
  floorApartment: '',
  isDefault: false,
};

const AccountAddresses = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [governorateId, setGovernorateId] = useState('');
  const [error, setError] = useState('');

  const areaOptions = KUWAIT_GOVERNORATES.find((g) => g.id === governorateId)?.areas || [];

  const load = () => {
    setLoading(true);
    api
      .get('/addresses')
      .then((res) => setAddresses(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setGovernorateId('');
    setEditingId(null);
    setError('');
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (addr) => {
    const gov = KUWAIT_GOVERNORATES.find((g) => g.en === addr.governorate || g.ar === addr.governorate);
    setForm({
      label: addr.label || '',
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      block: addr.block || '',
      street: addr.street || '',
      building: addr.building || '',
      floorApartment: addr.floorApartment || '',
      isDefault: !!addr.isDefault,
      area: addr.area || '',
    });
    setGovernorateId(gov ? gov.id : '');
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleGovernorateChange = (id) => {
    const gov = KUWAIT_GOVERNORATES.find((g) => g.id === id);
    setGovernorateId(id);
    setForm((prev) => ({ ...prev, governorate: gov ? (isAr ? gov.ar : gov.en) : '', area: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const gov = KUWAIT_GOVERNORATES.find((g) => g.id === governorateId);
    const payload = { ...form, governorate: gov ? (isAr ? gov.ar : gov.en) : '' };
    try {
      if (editingId) {
        await api.put(`/addresses/${editingId}`, payload);
      } else {
        await api.post('/addresses', payload);
      }
      setShowForm(false);
      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || t('account.save_failed'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('account.confirm_delete_address'))) return;
    await api.delete(`/addresses/${id}`);
    load();
  };

  const handleSetDefault = async (id) => {
    await api.put(`/addresses/${id}`, { isDefault: true });
    load();
  };

  return (
    <>
      <div className="account-content-header">
        <h2>{t('account.my_addresses')}</h2>
        {!showForm && (
          <button type="button" className="btn" onClick={openAddForm}>
            {t('account.add_address')}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="account-form">
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>{t('account.address_label')}</label>
              <input
                placeholder={t('account.address_label_placeholder')}
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>{t('checkout.full_name')}</label>
              <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t('checkout.phone')}</label>
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t('checkout.governorate')}</label>
              <select required value={governorateId} onChange={(e) => handleGovernorateChange(e.target.value)}>
                <option value="" disabled>
                  {t('checkout.select_governorate')}
                </option>
                {KUWAIT_GOVERNORATES.map((gov) => (
                  <option key={gov.id} value={gov.id}>
                    {isAr ? gov.ar : gov.en}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t('checkout.area')}</label>
              <select
                required
                value={form.area || ''}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                disabled={!governorateId}
              >
                <option value="" disabled>
                  {governorateId ? t('checkout.select_area') : t('checkout.select_governorate_first')}
                </option>
                {areaOptions.map((a) => (
                  <option key={a.en} value={isAr ? a.ar : a.en}>
                    {isAr ? a.ar : a.en}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t('checkout.block')}</label>
              <input value={form.block} onChange={(e) => setForm({ ...form, block: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t('checkout.street')}</label>
              <input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t('checkout.building')}</label>
              <input value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t('checkout.floor_apartment')}</label>
              <input value={form.floorApartment} onChange={(e) => setForm({ ...form, floorApartment: e.target.value })} />
            </div>
          </div>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
            />
            {t('account.set_as_default')}
          </label>
          {error && <p className="error-text">{error}</p>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn account-save-btn">
              {t('account.save')}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
            >
              {t('account.cancel')}
            </button>
          </div>
        </form>
      )}

      {!showForm && !loading && !addresses.length && <p>{t('account.no_addresses')}</p>}

      {!showForm && !!addresses.length && (
        <div className="address-list">
          {addresses.map((addr) => (
            <div key={addr.id} className="address-card">
              <div className="address-card-header">
                <strong>{addr.label || addr.fullName}</strong>
                {addr.isDefault && <span className="badge">{t('account.default')}</span>}
              </div>
              <p>{addr.fullName} &middot; {addr.phone}</p>
              <p>
                {[addr.governorate, addr.area, addr.block, addr.street, addr.building, addr.floorApartment]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <div className="address-card-actions">
                <button type="button" className="btn-link" onClick={() => openEditForm(addr)}>
                  {t('account.edit')}
                </button>
                {!addr.isDefault && (
                  <button type="button" className="btn-link" onClick={() => handleSetDefault(addr.id)}>
                    {t('account.set_as_default')}
                  </button>
                )}
                <button type="button" className="btn-link btn-link-danger" onClick={() => handleDelete(addr.id)}>
                  {t('account.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AccountAddresses;

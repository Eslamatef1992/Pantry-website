import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import NotFound from './NotFound';

const ContactForm = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/contact', form);
      setStatus('sent');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="card" style={{ marginTop: 24, padding: 20 }}>
        <p>{t('contact_form.success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginTop: 24, padding: 20, maxWidth: 520 }}>
      <h3>{t('contact_form.title')}</h3>
      <div className="form-group">
        <label>{t('contact_form.name')}</label>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="form-group">
        <label>{t('contact_form.email')}</label>
        <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div className="form-group">
        <label>{t('contact_form.phone')}</label>
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+965 ..." />
      </div>
      <div className="form-group">
        <label>{t('contact_form.message')}</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: 10, font: 'inherit' }}
        />
      </div>
      {status === 'error' && <p style={{ color: '#dc2626', marginBottom: 12 }}>{t('contact_form.error')}</p>}
      <button type="submit" className="btn" disabled={status === 'sending'}>
        {status === 'sending' ? t('contact_form.sending') : t('contact_form.send')}
      </button>
    </form>
  );
};

const StaticPage = () => {
  const { slug } = useParams();
  const { i18n, t } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [page, setPage] = useState(undefined);

  useEffect(() => {
    setPage(undefined);
    api
      .get(`/pages/${slug}`)
      .then((res) => setPage(res.data))
      .catch(() => setPage(null));
  }, [slug]);

  // The "Contact Us" static page always shows the form, even if no CMS page
  // has been created yet for this slug -- the form itself doesn't depend on it.
  if (page === undefined && slug !== 'contact-us') return null;
  if (page === null && slug !== 'contact-us') return <NotFound />;

  return (
    <div className="container static-page" style={{ marginTop: 30, marginBottom: 40, maxWidth: 760 }}>
      <h1>{page ? (isAr ? page.titleAr : page.titleEn) : t('nav.contact')}</h1>
      {page && <div className="static-page-content">{isAr ? page.contentAr : page.contentEn}</div>}
      {slug === 'contact-us' && <ContactForm />}
    </div>
  );
};

export default StaticPage;

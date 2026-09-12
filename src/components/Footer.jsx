import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import visaIcon from '../assets/payment-visa.svg';
import mastercardIcon from '../assets/payment-mastercard.svg';

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1v3.6c0 .6-.4 1-1 1C10.6 21.2 2.8 13.4 2.8 4.1c0-.6.4-1 1-1H7.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1.1L6.6 10.8Z" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.4c0-.9.3-1.5 1.6-1.5h1.6V4.2C16.4 4.1 15.4 4 14.3 4c-2.3 0-3.9 1.4-3.9 4v2.4H7.8v3h2.6V21h3.1Z" />
  </svg>
);

const Footer = () => {
  const { t } = useTranslation();
  const [site, setSite] = useState(null);

  useEffect(() => {
    api
      .get('/settings/site')
      .then((res) => setSite(res.data))
      .catch(() => setSite(null));
  }, []);

  const hasContact = site && (site.phone1 || site.phone2 || site.email);

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand-col">
          <div className="footer-brand">
            <img src="/logo-white.svg" alt={t('brand')} onError={(e) => (e.target.style.display = 'none')} />
            <span>{t('brand')}</span>
          </div>
          <div className="footer-social">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <FacebookIcon />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>{t('footer.quick_links')}</h4>
          <Link to="/page/about-us">{t('nav.about')}</Link>
          <Link to="/page/contact-us">{t('nav.contact')}</Link>
        </div>

        {hasContact && (
          <div className="footer-col">
            <h4>{t('footer.contact_with')}</h4>
            {site.phone1 && (
              <a href={`tel:${site.phone1}`} className="footer-contact-row">
                <PhoneIcon /> <span>{site.phone1}</span>
              </a>
            )}
            {site.phone2 && (
              <a href={`tel:${site.phone2}`} className="footer-contact-row">
                <PhoneIcon /> <span>{site.phone2}</span>
              </a>
            )}
            {site.email && (
              <a href={`mailto:${site.email}`} className="footer-contact-row">
                <MailIcon /> <span>{site.email}</span>
              </a>
            )}
          </div>
        )}

        <div className="footer-col">
          <h4>{t('footer.conditions')}</h4>
          <Link to="/page/privacy-policy">{t('footer.privacy_policy')}</Link>
          <Link to="/page/terms-conditions">{t('footer.terms')}</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {t('brand')}. {t('footer.rights')}
        </span>
        <span className="footer-payment">
          <img src={visaIcon} alt="Visa" />
          <img src={mastercardIcon} alt="Mastercard" />
        </span>
      </div>
    </footer>
  );
};

export default Footer;

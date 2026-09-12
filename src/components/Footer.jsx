import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/logo-white.svg" alt={t('brand')} onError={(e) => (e.target.style.display = 'none')} />
          <span>{t('brand')}</span>
        </div>

        <div className="footer-col">
          <h4>{t('footer.quick_links')}</h4>
          <Link to="/page/about-us">{t('nav.about')}</Link>
          <Link to="/page/contact-us">{t('nav.contact')}</Link>
        </div>

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
        <span className="footer-payment">VISA · MASTERCARD</span>
      </div>
    </footer>
  );
};

export default Footer;

import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n/i18n';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const next = i18n.language === 'en' ? 'ar' : 'en';

  return (
    <button
      type="button"
      className="lang-switch"
      onClick={() => changeLanguage(next)}
      aria-label="Switch language"
      title={next === 'ar' ? 'العربية' : 'English'}
    >
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="6" fill="white" />
        <clipPath id="flagClip">
          <rect x="1" y="6" width="30" height="20" rx="3" />
        </clipPath>
        <g clipPath="url(#flagClip)">
          <path d="M32 6.66875H0V12.8688H32V6.66875Z" fill="#429976" />
          <path d="M32 12.8688H0V19.1001H32V12.8688Z" fill="white" />
          <path d="M32 19.1001H0V25.3313H32V19.1001Z" fill="#BD1F34" />
          <path d="M0 6.66875V25.3375L9.33125 19.1V12.8688L0.04375 6.66875H0Z" fill="#010101" />
        </g>
      </svg>
    </button>
  );
};

export default LanguageSwitcher;

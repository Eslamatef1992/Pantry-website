import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const BannerCarousel = ({ banners }) => {
  const { i18n } = useTranslation();
  const [active, setActive] = useState(0);
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    if (banners.length < 2) return undefined;
    const id = setInterval(() => setActive((a) => (a + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [banners.length]);

  if (!banners.length) return null;

  return (
    <div className="banner-carousel">
      {banners.map((b, i) => (
        <Link
          key={b.id}
          to={b.linkUrl || '/shop'}
          className="banner-slide"
          style={{ backgroundImage: `url(${b.image})`, opacity: i === active ? 1 : 0, zIndex: i === active ? 1 : 0 }}
        >
          <div className="banner-overlay">
            {(isAr ? b.titleAr : b.titleEn) && <h2>{isAr ? b.titleAr : b.titleEn}</h2>}
            {(isAr ? b.subtitleAr : b.subtitleEn) && <p>{isAr ? b.subtitleAr : b.subtitleEn}</p>}
          </div>
        </Link>
      ))}
      {banners.length > 1 && (
        <div className="banner-dots">
          {banners.map((b, i) => (
            <button
              key={b.id}
              className={i === active ? 'active' : ''}
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;

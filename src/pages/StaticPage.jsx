import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import NotFound from './NotFound';

const StaticPage = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [page, setPage] = useState(undefined);

  useEffect(() => {
    setPage(undefined);
    api
      .get(`/pages/${slug}`)
      .then((res) => setPage(res.data))
      .catch(() => setPage(null));
  }, [slug]);

  if (page === undefined) return null;
  if (page === null) return <NotFound />;

  return (
    <div className="container static-page" style={{ marginTop: 30, marginBottom: 40, maxWidth: 760 }}>
      <h1>{isAr ? page.titleAr : page.titleEn}</h1>
      <div className="static-page-content">{isAr ? page.contentAr : page.contentEn}</div>
    </div>
  );
};

export default StaticPage;

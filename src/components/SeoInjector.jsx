import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const setMetaTag = (name, content) => {
  if (!content) return;
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const applyMeta = (meta, lang) => {
  if (!meta) return;
  const title = lang === 'ar' ? meta.metaTitleAr || meta.metaTitleEn : meta.metaTitleEn || meta.metaTitleAr;
  const description =
    lang === 'ar' ? meta.metaDescriptionAr || meta.metaDescriptionEn : meta.metaDescriptionEn || meta.metaDescriptionAr;
  if (title) document.title = title;
  if (description) setMetaTag('description', description);
  if (meta.metaKeywords) setMetaTag('keywords', meta.metaKeywords);
};

// Recreates <script> elements found inside a raw HTML string so they
// actually execute (scripts inserted via innerHTML never run).
const injectRawCode = (code, key) => {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-seo-pixel', key);
  wrapper.style.display = 'none';

  const template = document.createElement('template');
  template.innerHTML = code;

  template.content.childNodes.forEach((node) => {
    if (node.nodeName === 'SCRIPT') {
      const script = document.createElement('script');
      Array.from(node.attributes || []).forEach((attr) => script.setAttribute(attr.name, attr.value));
      if (node.textContent) script.textContent = node.textContent;
      wrapper.appendChild(script);
    } else {
      wrapper.appendChild(node.cloneNode(true));
    }
  });

  document.body.appendChild(wrapper);
};

const addScript = (content, key, { src, async } = {}) => {
  const s = document.createElement('script');
  s.setAttribute('data-seo-pixel', key);
  if (src) {
    s.src = src;
    if (async) s.async = true;
  }
  if (content) s.textContent = content;
  document.head.appendChild(s);
  return s;
};

const addNoscript = (html, key, target = document.body, prepend = false) => {
  const wrap = document.createElement('div');
  wrap.setAttribute('data-seo-pixel', key);
  wrap.innerHTML = `<noscript>${html}</noscript>`;
  if (prepend) target.insertBefore(wrap, target.firstChild);
  else target.appendChild(wrap);
};

const PIXEL_BUILDERS = {
  gtm: (id, key) => {
    addScript(
      `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0], j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl; f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`,
      key
    );
    addNoscript(
      `<iframe src="https://www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden"></iframe`,
      key,
      document.body,
      true
    );
  },
  ga4: (id, key) => {
    addScript(null, key, { src: `https://www.googletagmanager.com/gtag/js?id=${id}`, async: true });
    addScript(
      `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`,
      key
    );
  },
  snap_pixel: (id, key) => {
    addScript(
      `(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;r.src=n;
var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u)})(window,document,'https://sc-static.net/scevent.min.js');
snaptr('init', '${id}');
snaptr('track', 'PAGE_VIEW');`,
      key
    );
  },
  facebook_pixel: (id, key) => {
    addScript(
      `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${id}');
fbq('track', 'PageView');`,
      key
    );
    addNoscript(
      `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1" />`,
      key
    );
  },
  tiktok_pixel: (id, key) => {
    addScript(
      `!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<e.methods.length;n++)ttq.setAndDefer(e,e.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
  ttq.load('${id}');
  ttq.page();
}(window, document, 'ttq');`,
      key
    );
  },
};

const injectPixel = (p) => {
  const key = `seo-pixel-${p.type}-${p.id || p.pixelId || Math.random().toString(36).slice(2)}`;
  if (document.querySelector(`[data-seo-pixel="${key}"]`)) return;

  if (p.type === 'custom') {
    if (p.code) injectRawCode(p.code, key);
    return;
  }
  const builder = PIXEL_BUILDERS[p.type];
  if (builder && p.pixelId) builder(p.pixelId, key);
};

let pixelsInjected = false;

// Fetches the super-admin-managed SEO settings and tracking pixels, then
// applies the document meta tags and injects each active pixel/script
// directly into the live page. Renders nothing.
const SeoInjector = () => {
  const { i18n } = useTranslation();
  const metaRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/seo/public')
      .then((res) => {
        if (cancelled) return;
        const { meta, pixels } = res.data || {};
        metaRef.current = meta;
        applyMeta(meta, i18n.language);

        if (!pixelsInjected) {
          pixelsInjected = true;
          (pixels || []).forEach((p) => {
            try {
              injectPixel(p);
            } catch {
              // never let a bad pixel config break the storefront
            }
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (metaRef.current) applyMeta(metaRef.current, i18n.language);
  }, [i18n.language]);

  return null;
};

export default SeoInjector;

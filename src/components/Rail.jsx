import { forwardRef } from 'react';

// The horizontally-scrollable track used for the category and product rails
// on the homepage. Scrolling is driven by RailArrows placed in the section
// header, via a shared ref, matching the "title ... View all  ‹ ›" layout.
const Rail = forwardRef(({ children, className = '' }, ref) => (
  <div className={`rail ${className}`} ref={ref}>
    {children}
  </div>
));

export const scrollRail = (ref, dir) => {
  if (!ref.current) return;
  const amount = ref.current.clientWidth * 0.8 * dir;
  ref.current.scrollBy({ left: amount, behavior: 'smooth' });
};

export const RailArrows = ({ railRef }) => (
  <span className="rail-arrows">
    <button type="button" className="rail-arrow" onClick={() => scrollRail(railRef, -1)} aria-label="prev">
      ‹
    </button>
    <button type="button" className="rail-arrow rail-arrow-primary" onClick={() => scrollRail(railRef, 1)} aria-label="next">
      ›
    </button>
  </span>
);

export default Rail;

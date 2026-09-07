import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container" style={{ marginTop: 60, textAlign: 'center' }}>
    <h1>404</h1>
    <p>Page not found.</p>
    <Link to="/" className="btn">
      Back Home
    </Link>
  </div>
);

export default NotFound;

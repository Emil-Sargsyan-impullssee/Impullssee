import { FiHome } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page not found</h2>
        <p className="not-found-message">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <a href="/" className="not-found-button">
          <FiHome className="icon-md" />
          Back to Home
        </a>
      </div>
    </div>
  );
}

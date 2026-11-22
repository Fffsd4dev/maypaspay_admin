/**
 * One layout for all error pages (403, 404, 500), using the same card as the auth screens.
 */
import { Link } from 'react-router-dom';
import AuthCard from '@/components/auth/AuthCard';

const ERRORS = {
  403: { title: 'Access denied', message: "You don't have permission to view this page. If you think this is a mistake, contact a super admin." },
  404: { title: 'Page not found', message: "The page you're looking for doesn't exist or has been moved." },
  500: { title: 'Something went wrong', message: 'An unexpected error happened on our side. Please try again in a moment.' },
};

const ErrorPage = ({ code }) => {
  const { title, message } = ERRORS[code] ?? ERRORS[500];

  return (
    <AuthCard title={title}>
      <h1 className="display-4 fw-bold text-primary mb-2">{code}</h1>
      <p className="text-muted mb-4">{message}</p>
      <div className="mb-4">
        <Link to="/dashboard" className="btn btn-primary">
          Back to dashboard
        </Link>
      </div>
    </AuthCard>
  );
};

export const Error403 = () => <ErrorPage code={403} />;
export const Error404 = () => <ErrorPage code={404} />;
export const Error500 = () => <ErrorPage code={500} />;

import { Alert, Button, Spinner } from 'react-bootstrap';
import AuthCard from '@/components/auth/AuthCard';
import TextFormInput from '@/components/form/TextFormInput';
import PasswordFormInput from '@/components/form/PasswordFormInput';
import useSignIn from '../useSignIn';

const inputClass = 'bg-light bg-opacity-50 border-light py-2';

const Login = () => {
  const { control, onSubmit, loading, error, notice } = useSignIn();

  return (
    <AuthCard title="Sign in to your account" subtitle="Enter your email address and password to access the admin panel.">
      {notice && !error && <Alert variant="info" className="text-start py-2">{notice}</Alert>}
      {error && <Alert variant="danger" className="text-start py-2">{error}</Alert>}

      <form onSubmit={onSubmit} className="text-start mb-3" noValidate>
        <div className="mb-3">
          <TextFormInput
            control={control}
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            autoComplete="username"
            className={inputClass}
          />
        </div>
        <div className="mb-3">
          <PasswordFormInput
            control={control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            className={inputClass}
          />
        </div>
        <div className="d-grid">
          <Button type="submit" variant="primary" className="fw-semibold" disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Continue'}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
};

export default Login;

/**
 * Step 2 of sign-in: enter the code emailed to the admin.
 * We deliberately do NOT show the email address on this screen.
 */
import { useState } from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '@/api/client';
import AuthCard from '@/components/auth/AuthCard';
import OtpInput from '@/components/form/OtpInput';
import { useAuthContext } from '@/context/useAuthContext';

// Change this if the API sends codes of a different length.
const CODE_LENGTH = 6;

// Submit automatically when the last digit is entered. Set to false to require the button.
const AUTO_SUBMIT = true;

const VerifyCodePage = () => {
  const { pendingLogin, verifyCode, cancelPendingLogin } = useAuthContext();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (fullCode = code) => {
    if (loading || fullCode.length !== CODE_LENGTH) return;

    setLoading(true);
    setError('');
    try {
      const redirectTo = await verifyCode(fullCode);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      setError(status === 401 || status === 422 ? 'That code is invalid or has expired.' : getErrorMessage(err));
      setCode(''); // clears the boxes and puts the cursor back in the first one
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (next) => {
    setCode(next);
    if (error && next) setError(''); // typing again clears the error
  };

  // No sign-in in progress (e.g. page refreshed or opened directly): start again.
  if (!pendingLogin) return <Navigate to="/auth/login" replace />;

  return (
    <AuthCard
      title="Enter verification code"
      subtitle="We've sent a verification code to your registered email. Check your inbox and enter the code below."
    >
      {error && <Alert variant="danger" className="text-start py-2">{error}</Alert>}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="text-start mb-3"
        noValidate
      >
        <label className="form-label">{CODE_LENGTH}-digit code</label>
        <OtpInput
          length={CODE_LENGTH}
          value={code}
          onChange={handleChange}
          onComplete={AUTO_SUBMIT ? submit : undefined}
          invalid={Boolean(error)}
          disabled={loading}
        />
        <p className="text-muted fs-12 mt-1 mb-3">Tip: you can paste the whole code.</p>

        <div className="d-grid">
          <Button type="submit" variant="primary" className="fw-semibold" disabled={loading || code.length !== CODE_LENGTH}>
            {loading ? <Spinner size="sm" /> : 'Verify and sign in'}
          </Button>
        </div>
      </form>

      <p className="text-muted fs-14 mb-4">
        Didn't get the code?{' '}
        <Link to="/auth/login" onClick={cancelPendingLogin} className="fw-semibold">
          Sign in again
        </Link>{' '}
        to request a new one.
      </p>
    </AuthCard>
  );
};

export default VerifyCodePage;
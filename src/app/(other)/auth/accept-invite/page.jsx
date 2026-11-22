/**
 * Accept invite: a new admin chooses their password.
 * Route: /accept-invite?token=... (the link in the invite email). Open to everyone.
 *
 * - The token is read once and removed from the address bar straight away,
 *   so it doesn't stay in browser history or show up in screenshots.
 * - The link works once and expires after 72 hours (API answers 422, code invite_invalid).
 * - On success the person is sent to the login page to sign in normally (password, then code).
 */
import { useEffect, useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { acceptInvite } from '@/api/auth';
import { getErrorMessage, getFieldErrors } from '@/api/client';
import { meetsPasswordRules } from '@/auth/passwordPolicy';
import AuthCard from '@/components/auth/AuthCard';
import PasswordChecklist from '@/components/auth/PasswordChecklist';
import PasswordInput from '@/components/form/PasswordInput';
import { useAuthContext } from '@/context/useAuthContext';

const readTokenFromLink = () => new URLSearchParams(window.location.search).get('token') ?? '';

const AcceptInvitePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, admin } = useAuthContext();

  const [token] = useState(readTokenFromLink); // read once, kept in memory only
  const [linkInvalid, setLinkInvalid] = useState(!token);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Remove the token from the address bar (and so from browser history).
  useEffect(() => {
    if (window.location.search) navigate('/accept-invite', { replace: true });
  }, [navigate]);

  const passwordsMatch = password === confirmation;
  const canSubmit = meetsPasswordRules(password) && confirmation && passwordsMatch && !loading;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setErrors({});
    try {
      await acceptInvite({ token, password, passwordConfirmation: confirmation });
      navigate('/auth/login?reason=invite-accepted', { replace: true });
    } catch (err) {
      if (err.response?.data?.code === 'invite_invalid') {
        setLinkInvalid(true);
        return;
      }
      const fieldErrors = getFieldErrors(err);
      setErrors(
        Object.keys(fieldErrors).length
          ? { password: fieldErrors.password, confirmation: fieldErrors.password_confirmation, general: fieldErrors.token }
          : { general: getErrorMessage(err) },
      );
    } finally {
      setLoading(false);
    }
  };

  // Someone is already signed in on this browser (e.g. a shared computer).
  if (isAuthenticated) {
    return (
      <AuthCard title="You're already signed in" subtitle={`This browser is signed in as ${admin?.name ?? 'another admin'}.`}>
        <p className="text-muted">To set up a new account from an invite, sign out first, then open the invite link again.</p>
        <div className="d-grid gap-2 mb-4">
          <Link to="/auth/logout" className="btn btn-primary">Sign out</Link>
          <Link to="/dashboard" className="btn btn-light">Go to dashboard</Link>
        </div>
      </AuthCard>
    );
  }

  // No token, already used, or expired.
  if (linkInvalid) {
    return (
      <AuthCard title="This invite link doesn't work">
        <p className="text-muted">
          It may have been used already, or it has expired (invite links last 72 hours). Ask an admin to resend your
          invite, then use the link in the new email.
        </p>
        <div className="d-grid mb-4">
          <Link to="/auth/login" className="btn btn-light">Go to sign in</Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Set up your account" subtitle="Choose a password for your admin account. You'll use it to sign in.">
      {errors.general && <Alert variant="danger" className="text-start py-2">{errors.general}</Alert>}

      <Form onSubmit={handleSubmit} className="text-start mb-3" noValidate>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>New password</Form.Label>
          <PasswordInput
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((current) => ({ ...current, password: undefined })); // editing clears the server's message
            }}
            autoComplete="new-password"
            autoFocus
            isInvalid={Boolean(errors.password)}
            feedback={errors.password}
          />
          <PasswordChecklist password={password} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password-confirmation">
          <Form.Label>Confirm password</Form.Label>
          <PasswordInput
            value={confirmation}
            onChange={(e) => {
              setConfirmation(e.target.value);
              setErrors((current) => ({ ...current, confirmation: undefined }));
            }}
            autoComplete="new-password"
            isInvalid={Boolean(errors.confirmation) || (confirmation.length > 0 && !passwordsMatch)}
            feedback={errors.confirmation ?? (confirmation.length > 0 && !passwordsMatch ? "Passwords don't match" : '')}
          />
        </Form.Group>

        <div className="d-grid">
          <Button type="submit" variant="primary" className="fw-semibold" disabled={!canSubmit}>
            {loading ? <Spinner size="sm" /> : 'Set password'}
          </Button>
        </div>
      </Form>

      <p className="text-muted fs-13 mb-4">Never share your password. MaypasPay staff will never ask for it.</p>
    </AuthCard>
  );
};

export default AcceptInvitePage;
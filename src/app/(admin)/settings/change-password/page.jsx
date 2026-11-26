/**
 * Change password, in two steps (like sign-in):
 *   1. Confirm the current password  -> POST /admin/auth/password/code  (API emails a code)
 *   2. Enter the code + new password -> POST /admin/auth/password
 *
 * The current password from step 1 is kept in memory only (component state) and sent again
 * in step 2, so the admin doesn't type it twice. It's cleared on success, on "Start again",
 * and when they leave the page.
 */
import { useState } from 'react';
import { Alert, Button, Card, CardBody, Col, Form, Row, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { changePassword, requestPasswordCode } from '@/api/auth';
import { getErrorMessage, getFieldErrors } from '@/api/client';
import { meetsPasswordRules } from '@/auth/passwordPolicy';
import PageTitle from '@/components/PageTitle';
import PasswordChecklist from '@/components/auth/PasswordChecklist';
import OtpInput from '@/components/form/OtpInput';
import PasswordInput from '@/components/form/PasswordInput';

// Change this if the API sends codes of a different length.
const CODE_LENGTH = 6;

const ChangePasswordPage = () => {
  const [step, setStep] = useState('confirm'); // 'confirm' -> 'new-password'
  const [currentPassword, setCurrentPassword] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const startAgain = () => {
    setStep('confirm');
    setCurrentPassword('');
    setCode('');
    setPassword('');
    setConfirmation('');
    setErrors({});
  };

  // ---- Step 1: confirm the current password ----
  const handleRequestCode = async (event) => {
    event.preventDefault();
    if (!currentPassword || loading) return;

    setLoading(true);
    setErrors({});
    try {
      await requestPasswordCode(currentPassword);
      setStep('new-password');
    } catch (err) {
      const fieldErrors = getFieldErrors(err);
      setErrors({ currentPassword: fieldErrors.current_password, general: fieldErrors.current_password ? '' : getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  // Sends a fresh code using the password already confirmed.
  const handleResend = async () => {
    setResending(true);
    setErrors({});
    try {
      await requestPasswordCode(currentPassword);
      setCode('');
      toast.info('A new code has been sent to your registered email.');
    } catch (err) {
      setErrors({ general: getErrorMessage(err) });
    } finally {
      setResending(false);
    }
  };

  // ---- Step 2: code + new password ----
  const passwordsMatch = password === confirmation;
  const sameAsCurrent = password !== '' && password === currentPassword;
  const canSubmit =
    code.length === CODE_LENGTH && meetsPasswordRules(password) && confirmation && passwordsMatch && !sameAsCurrent && !loading;

  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setErrors({});
    try {
      await changePassword({ code, currentPassword, password, passwordConfirmation: confirmation });
      startAgain();
      toast.success('Your password has been changed.');
    } catch (err) {
      const fieldErrors = getFieldErrors(err);

      // The current password no longer works (e.g. changed elsewhere): go back to step 1.
      if (fieldErrors.current_password) {
        startAgain();
        setErrors({ currentPassword: fieldErrors.current_password });
        return;
      }
      if (fieldErrors.code) setCode(''); // clears the boxes for another try

      setErrors(
        Object.keys(fieldErrors).length
          ? { code: fieldErrors.code, password: fieldErrors.password, confirmation: fieldErrors.password_confirmation }
          : { general: getErrorMessage(err) },
      );
    } finally {
      setLoading(false);
    }
  };

  // When the last digit is entered, jump to the new password field.
  const focusNewPassword = () => document.getElementById('newPassword')?.focus();

  return (
    <>
      <PageTitle title="Change Password" subTitle="Settings" />
      <Row>
        <Col lg={6}>
          <Card>
            <CardBody>
              <p className="text-muted fs-13 mb-3">Step {step === 'confirm' ? 1 : 2} of 2</p>
              {errors.general && <Alert variant="danger" className="py-2">{errors.general}</Alert>}

              {step === 'confirm' ? (
                <form onSubmit={handleRequestCode} noValidate>
                  <p className="mb-3">First, confirm your current password. We'll then send a verification code to your registered email.</p>
                  <Form.Group className="mb-3" controlId="currentPassword">
                    <Form.Label>Current password</Form.Label>
                    <PasswordInput
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      autoComplete="current-password"
                      autoFocus
                      isInvalid={Boolean(errors.currentPassword)}
                      feedback={errors.currentPassword}
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary" disabled={!currentPassword || loading}>
                    {loading ? <Spinner size="sm" /> : 'Continue'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleChangePassword} noValidate>
                  <p className="mb-3">We've sent a verification code to your registered email. Enter it below with your new password.</p>

                  <div className="mb-3">
                    <label className="form-label">{CODE_LENGTH}-digit code</label>
                    <OtpInput
                      length={CODE_LENGTH}
                      value={code}
                      onChange={setCode}
                      onComplete={focusNewPassword}
                      invalid={Boolean(errors.code)}
                      disabled={loading}
                    />
                    {errors.code && <div className="invalid-feedback d-block">{errors.code}</div>}
                    <div className="fs-13 mt-2">
                      <span className="text-muted">Didn't get it? </span>
                      <button type="button" className="btn btn-link p-0 fs-13 align-baseline" onClick={handleResend} disabled={resending}>
                        {resending ? 'Sending…' : 'Send a new code'}
                      </button>
                    </div>
                  </div>

                  <Form.Group className="mb-3" controlId="newPassword">
                    <Form.Label>New password</Form.Label>
                    <PasswordInput
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      isInvalid={Boolean(errors.password) || sameAsCurrent}
                      feedback={sameAsCurrent ? 'The new password must be different from the current one.' : errors.password}
                    />
                    <PasswordChecklist password={password} />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Confirm new password</Form.Label>
                    <PasswordInput
                      value={confirmation}
                      onChange={(e) => setConfirmation(e.target.value)}
                      autoComplete="new-password"
                      isInvalid={Boolean(errors.confirmation) || (confirmation !== '' && !passwordsMatch)}
                      feedback={confirmation !== '' && !passwordsMatch ? 'Passwords do not match.' : errors.confirmation}
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button type="submit" variant="primary" disabled={!canSubmit}>
                      {loading ? <Spinner size="sm" /> : 'Update password'}
                    </Button>
                    <button type="button" className="btn btn-light" onClick={startAgain} disabled={loading}>
                      Start again
                    </button>
                  </div>
                </form>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ChangePasswordPage;
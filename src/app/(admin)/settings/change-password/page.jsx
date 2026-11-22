import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Alert, Button, Card, CardBody, Col, Row, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { changePassword } from '@/api/auth';
import { getErrorMessage, getFieldErrors } from '@/api/client';
import PageTitle from '@/components/PageTitle';
import PasswordFormInput from '@/components/form/PasswordFormInput';

// Keep these rules in line with the backend's password rules.
const MIN_LENGTH = 8;

const schema = yup.object({
  currentPassword: yup.string().required('Please enter your current password'),
  password: yup
    .string()
    .required('Please enter a new password')
    .min(MIN_LENGTH, `Use at least ${MIN_LENGTH} characters`)
    .matches(/[a-z]/, 'Include at least one lowercase letter')
    .matches(/[A-Z]/, 'Include at least one uppercase letter')
    .matches(/\d/, 'Include at least one number')
    .notOneOf([yup.ref('currentPassword')], 'The new password must be different from the current one'),
  passwordConfirmation: yup
    .string()
    .required('Please confirm the new password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

// Maps the API's field names (snake_case) to this form's field names.
const API_FIELD_TO_FORM_FIELD = {
  current_password: 'currentPassword',
  password: 'password',
  password_confirmation: 'passwordConfirmation',
};

const ChangePasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { control, handleSubmit, reset, setError: setFieldError } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { currentPassword: '', password: '', passwordConfirmation: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true);
    setError('');
    try {
      await changePassword(values);
      reset();
      toast.success('Your password has been changed.');
    } catch (err) {
      const fieldErrors = getFieldErrors(err);
      Object.entries(fieldErrors).forEach(([apiField, message]) => {
        const field = API_FIELD_TO_FORM_FIELD[apiField];
        if (field) setFieldError(field, { message });
      });
      if (Object.keys(fieldErrors).length === 0) setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  });

  return (
    <>
      <PageTitle title="Change Password" subTitle="Settings" />
      <Row>
        <Col lg={6}>
          <Card>
            <CardBody>
              {error && <Alert variant="danger" className="py-2">{error}</Alert>}

              <form onSubmit={onSubmit} noValidate>
                <div className="mb-3">
                  <PasswordFormInput control={control} name="currentPassword" label="Current password" autoComplete="current-password" />
                </div>
                <div className="mb-3">
                  <PasswordFormInput control={control} name="password" label="New password" autoComplete="new-password" />
                  <small className="text-muted">
                    At least {MIN_LENGTH} characters, with uppercase, lowercase and a number.
                  </small>
                </div>
                <div className="mb-3">
                  <PasswordFormInput control={control} name="passwordConfirmation" label="Confirm new password" autoComplete="new-password" />
                </div>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : 'Update password'}
                </Button>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ChangePasswordPage;

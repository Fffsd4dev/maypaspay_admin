/**
 * Invite a new admin. They get an email link (valid 72 hours) and choose their own password.
 */
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { inviteAdmin } from '@/api/admins';
import { getErrorMessage, getFieldErrors } from '@/api/client';
import TextFormInput from '@/components/form/TextFormInput';
import { notifyResult } from '@/utils/notifyResult';
import RoleSelect from './RoleSelect';

const schema = yup.object({
  name: yup.string().trim().required('Please enter their name').max(255),
  email: yup.string().trim().email('Please enter a valid email').required('Please enter their email'),
  role_id: yup.string().required('Please choose a role'),
  reason: yup.string().trim().max(500, 'Keep the reason under 500 characters'),
});

const EMPTY_FORM = { name: '', email: '', role_id: '', reason: '' };

const InviteAdminModal = ({ show, roles, onClose, onDone }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { control, handleSubmit, reset, setError: setFieldError } = useForm({
    resolver: yupResolver(schema),
    defaultValues: EMPTY_FORM,
  });

  const handleClose = () => {
    if (loading) return;
    reset(EMPTY_FORM);
    setError('');
    onClose();
  };

  const onSubmit = handleSubmit(async ({ name, email, role_id, reason }) => {
    setLoading(true);
    setError('');
    try {
      const body = { name, email, role_id: Number(role_id) };
      if (reason) body.reason = reason;

      const response = await inviteAdmin(body);
      notifyResult(response, `Invite sent to ${email}.`);
      reset(EMPTY_FORM);
      onClose();
      onDone();
    } catch (err) {
      const fieldErrors = getFieldErrors(err);
      Object.entries(fieldErrors).forEach(([field, message]) => setFieldError(field, { message }));
      if (Object.keys(fieldErrors).length === 0) setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  });

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form onSubmit={onSubmit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title as="h5">Invite admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger" className="py-2">{error}</Alert>}
          <p className="text-muted fs-13">
            They'll get an email link (valid for 72 hours) to set their own password. They can't sign in until they accept.
          </p>

          <div className="mb-3">
            <TextFormInput control={control} name="name" label="Full name" autoComplete="off" />
          </div>
          <div className="mb-3">
            <TextFormInput control={control} name="email" type="email" label="Email" autoComplete="off" />
          </div>
          <Form.Group className="mb-3" controlId="invite-role">
            <Form.Label>Role</Form.Label>
            <Controller
              name="role_id"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <RoleSelect roles={roles} value={field.value} onChange={field.onChange} isInvalid={Boolean(fieldState.error)} />
                  <Form.Control.Feedback type="invalid">{fieldState.error?.message}</Form.Control.Feedback>
                </>
              )}
            />
          </Form.Group>
          <div>
            <TextFormInput
              control={control}
              name="reason"
              as="textarea"
              rows={2}
              label="Reason (optional)"
              placeholder="This is saved in the audit log"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Send invite'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default InviteAdminModal;

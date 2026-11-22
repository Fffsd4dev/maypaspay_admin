import { useState } from 'react';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { changeAdminRole } from '@/api/admins';
import { getErrorMessage, getFieldErrors } from '@/api/client';
import { notifyResult } from '@/utils/notifyResult';
import RoleSelect from './RoleSelect';

const MIN_REASON = 3;
const MAX_REASON = 500;

const ChangeRoleModal = ({ show, admin, roles, onClose, onDone }) => {
  const [roleId, setRoleId] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const trimmedReason = reason.trim();
  const isSameRole = Number(roleId) === admin?.role?.id;
  const canSubmit = roleId && !isSameRole && trimmedReason.length >= MIN_REASON && trimmedReason.length <= MAX_REASON;

  const handleClose = () => {
    if (loading) return;
    setRoleId('');
    setReason('');
    setErrors({});
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setErrors({});
    try {
      const response = await changeAdminRole(admin.uuid, { role_id: Number(roleId), reason: trimmedReason });
      notifyResult(response, `${admin.name}'s role has been changed.`);
      setRoleId('');
      setReason('');
      onClose();
      onDone();
    } catch (err) {
      const fieldErrors = getFieldErrors(err);
      setErrors(Object.keys(fieldErrors).length ? fieldErrors : { general: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title as="h5">Change role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errors.general && <Alert variant="danger" className="py-2">{errors.general}</Alert>}
          <p className="mb-3">
            <strong>{admin?.name}</strong> is currently <strong>{admin?.role?.label}</strong>. The change applies on their
            next request.
          </p>

          <Form.Group className="mb-3" controlId="change-role">
            <Form.Label>New role</Form.Label>
            <RoleSelect roles={roles} value={roleId} onChange={setRoleId} isInvalid={Boolean(errors.role_id)} />
            {isSameRole && <Form.Text className="text-warning">This is their current role.</Form.Text>}
            <Form.Control.Feedback type="invalid">{errors.role_id}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="change-role-reason">
            <Form.Label>Reason</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reason}
              maxLength={MAX_REASON}
              onChange={(e) => setReason(e.target.value)}
              placeholder="This is saved in the audit log"
              isInvalid={Boolean(errors.reason)}
            />
            <Form.Control.Feedback type="invalid">{errors.reason}</Form.Control.Feedback>
            <Form.Text muted>
              {MIN_REASON}–{MAX_REASON} characters.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading || !canSubmit}>
            {loading ? <Spinner size="sm" /> : 'Change role'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ChangeRoleModal;

/**
 * A confirm dialog for sensitive actions. Optionally asks for a reason (saved in the audit log).
 *
 * reason: 'required' | 'optional' | 'none'
 * onConfirm(body) gets { reason } (or undefined) and should return a promise; errors are shown in the dialog.
 */
import { useState } from 'react';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { getErrorMessage } from '@/api/client';

const MIN_REASON = 3;
const MAX_REASON = 500;

const ReasonModal = ({ show, title, subject, confirmText, reason = 'none', danger, onConfirm, onClose }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const trimmed = value.trim();
  const reasonInvalid =
    (reason === 'required' && trimmed.length < MIN_REASON) ||
    (trimmed.length > 0 && trimmed.length < MIN_REASON) ||
    trimmed.length > MAX_REASON;

  const handleClose = () => {
    if (loading) return;
    setValue('');
    setError('');
    onClose();
  };

  const handleConfirm = async (event) => {
    event.preventDefault();
    if (reasonInvalid) return;

    setLoading(true);
    setError('');
    try {
      await onConfirm(trimmed ? { reason: trimmed } : undefined);
      setValue('');
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form onSubmit={handleConfirm} noValidate>
        <Modal.Header closeButton>
          <Modal.Title as="h5">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger" className="py-2">{error}</Alert>}
          <p className="mb-3">
            {subject && <strong>{subject}: </strong>}
            {confirmText}
          </p>

          {reason !== 'none' && (
            <Form.Group controlId="action-reason">
              <Form.Label>
                Reason {reason === 'optional' && <span className="text-muted">(optional)</span>}
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={value}
                maxLength={MAX_REASON}
                onChange={(e) => setValue(e.target.value)}
                placeholder="This is saved in the audit log"
                autoFocus
              />
              <Form.Text muted>
                {MIN_REASON}–{MAX_REASON} characters.
              </Form.Text>
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant={danger ? 'danger' : 'primary'} disabled={loading || reasonInvalid}>
            {loading ? <Spinner size="sm" /> : title}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ReasonModal;
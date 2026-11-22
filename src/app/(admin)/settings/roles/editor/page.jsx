/**
 * Create or edit a role.
 * Routes: /settings/roles/new and /settings/roles/:id (need settings.roles)
 *
 * When editing, the full permission list is sent and replaces the old one (API rule),
 * and a summary shows exactly what will be added and removed before saving.
 */
import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, CardBody, Col, Form, Row, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage, getFieldErrors } from '@/api/client';
import { createRole, getRole, updateRole } from '@/api/roles';
import PageTitle from '@/components/PageTitle';
import { useAuthContext } from '@/context/useAuthContext';
import { notifyResult } from '@/utils/notifyResult';
import PermissionPicker from '../components/PermissionPicker';
import { ROLE_NAME_PATTERN, SENSITIVE_PERMISSIONS, makeCanGrant, toRoleName } from '../roleRules';
import usePermissionGroups from '../usePermissionGroups';

const MIN_REASON = 3;
const MAX_REASON = 500;

const RoleEditorPage = () => {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { admin: me } = useAuthContext();
  const canGrant = useMemo(() => makeCanGrant(me), [me]);
  const { groups, error: permissionsError } = usePermissionGroups();

  const [original, setOriginal] = useState(null); // the role as loaded (edit only)
  const [loading, setLoading] = useState(!isNew);
  const [loadError, setLoadError] = useState('');

  const [label, setLabel] = useState('');
  const [name, setName] = useState('');
  const [nameEdited, setNameEdited] = useState(false); // stop auto-filling once the user types a name
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [reason, setReason] = useState('');

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Load the role when editing.
  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    getRole(id)
      .then((role) => {
        if (cancelled) return;
        setOriginal(role);
        setLabel(role.label ?? '');
        setName(role.name);
        setDescription(role.description ?? '');
        setPermissions(role.permissions ?? []);
      })
      .catch((err) => !cancelled && setLoadError(err.response?.status === 404 ? 'This role was not found.' : getErrorMessage(err)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, isNew]);

  // While creating, suggest a name from the label until the user edits the name themselves.
  const handleLabelChange = (value) => {
    setLabel(value);
    if (isNew && !nameEdited) setName(toRoleName(value));
  };

  // What will change (edit only).
  const added = original ? permissions.filter((p) => !original.permissions.includes(p)) : permissions;
  const removed = original ? original.permissions.filter((p) => !permissions.includes(p)) : [];
  const needsApproval = added.some((p) => SENSITIVE_PERMISSIONS.includes(p));
  const hasChanges =
    isNew || added.length > 0 || removed.length > 0 || label.trim() !== (original?.label ?? '') || description.trim() !== (original?.description ?? '');

  const validate = () => {
    const found = {};
    const trimmedReason = reason.trim();
    if (!label.trim()) found.label = 'Please give the role a name people will see';
    if (isNew && !ROLE_NAME_PATTERN.test(name)) {
      found.name = 'Lowercase letters, numbers and underscores only, starting with a letter (max 64)';
    }
    if (!isNew && trimmedReason.length < MIN_REASON) found.reason = `Please give a reason (at least ${MIN_REASON} characters)`;
    if (trimmedReason && trimmedReason.length < MIN_REASON) found.reason = `At least ${MIN_REASON} characters`;
    return found;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      const body = { label: label.trim(), description: description.trim() || null, permissions };
      if (reason.trim()) body.reason = reason.trim();

      const response = isNew ? await createRole({ ...body, name }) : await updateRole(id, body);
      notifyResult(response, isNew ? `The ${body.label} role has been created.` : `The ${body.label} role has been updated.`);
      navigate('/settings/roles');
    } catch (err) {
      const fieldErrors = getFieldErrors(err);
      setErrors(Object.keys(fieldErrors).length ? fieldErrors : { general: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const title = isNew ? 'New role' : `Edit ${original?.label ?? 'role'}`;

  if (loading || (!groups && !permissionsError && !loadError)) {
    return (
      <div className="text-center py-5">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <PageTitle title={title} subTitle="Roles" />
      <Link to="/settings/roles" className="d-inline-block mb-3">
        ← Back to roles
      </Link>

      {(loadError || permissionsError) && <Alert variant="danger">{loadError || permissionsError}</Alert>}

      {original?.is_system && (
        <Alert variant="secondary">The {original.label} role is built in. It has every permission and can't be edited.</Alert>
      )}

      {groups && !loadError && !original?.is_system && (
        <Form onSubmit={handleSubmit} noValidate>
          {errors.general && <Alert variant="danger" className="py-2">{errors.general}</Alert>}

          <Row>
            <Col lg={4}>
              <Card>
                <CardBody>
                  <h5 className="mb-3">Details</h5>

                  <Form.Group className="mb-3" controlId="role-label">
                    <Form.Label>Display name</Form.Label>
                    <Form.Control value={label} onChange={(e) => handleLabelChange(e.target.value)} isInvalid={Boolean(errors.label)} placeholder="e.g. Finance lead" />
                    <Form.Control.Feedback type="invalid">{errors.label}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="role-name">
                    <Form.Label>System name</Form.Label>
                    <Form.Control
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setNameEdited(true);
                      }}
                      disabled={!isNew}
                      isInvalid={Boolean(errors.name)}
                      className="font-monospace"
                      placeholder="finance_lead"
                    />
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    <Form.Text muted>{isNew ? "Used by the system. It can't be changed later." : "Can't be changed."}</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="role-description">
                    <Form.Label>
                      Description <span className="text-muted">(optional)</span>
                    </Form.Label>
                    <Form.Control as="textarea" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} isInvalid={Boolean(errors.description)} />
                    <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                  </Form.Group>

                  {!isNew && (
                    <p className="text-muted fs-13 mb-0">
                      {original.admins_count} admin{original.admins_count === 1 ? '' : 's'} have this role. Changes apply on their next request.
                    </p>
                  )}
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h5 className="mb-3">{isNew ? 'Summary' : 'Changes'}</h5>
                  {added.length === 0 && removed.length === 0 && <p className="text-muted fs-13">{isNew ? 'No permissions selected yet.' : 'No permission changes.'}</p>}
                  {added.length > 0 && (
                    <p className="fs-13 mb-2">
                      <span className="text-success fw-semibold">{isNew ? 'Permissions' : 'Adding'}:</span> {added.join(', ')}
                    </p>
                  )}
                  {removed.length > 0 && (
                    <p className="fs-13 mb-2">
                      <span className="text-danger fw-semibold">Removing:</span> {removed.join(', ')}
                    </p>
                  )}
                  {needsApproval && (
                    <Alert variant="warning" className="py-2 fs-13">
                      This adds a sensitive permission, so another admin must approve it before it takes effect.
                    </Alert>
                  )}

                  <Form.Group className="mb-3" controlId="role-reason">
                    <Form.Label>
                      Reason {isNew && <span className="text-muted">(optional)</span>}
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={reason}
                      maxLength={MAX_REASON}
                      onChange={(e) => setReason(e.target.value)}
                      isInvalid={Boolean(errors.reason)}
                      placeholder="This is saved in the audit log"
                    />
                    <Form.Control.Feedback type="invalid">{errors.reason}</Form.Control.Feedback>
                  </Form.Group>

                  <Button type="submit" variant="primary" className="w-100" disabled={saving || !hasChanges}>
                    {saving ? <Spinner size="sm" /> : isNew ? 'Create role' : 'Save changes'}
                  </Button>
                </CardBody>
              </Card>
            </Col>

            <Col lg={8}>
              <Card>
                <CardBody>
                  <h5 className="mb-1">Permissions</h5>
                  <p className="text-muted fs-13">You can only give permissions you have yourself.</p>
                  {errors.permissions && <Alert variant="danger" className="py-2">{errors.permissions}</Alert>}
                  <PermissionPicker groups={groups} selected={permissions} onChange={setPermissions} canGrant={canGrant} disabled={saving} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
};

export default RoleEditorPage;
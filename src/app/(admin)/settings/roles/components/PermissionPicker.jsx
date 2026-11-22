/**
 * Grouped checkboxes for choosing a role's permissions.
 *
 * - Permissions you don't hold yourself are locked (the API would refuse them).
 *   If the role already has one of those, it stays ticked and is kept.
 * - Sensitive permissions are marked: adding them needs a second admin's approval.
 */
import { Badge, Col, Form, Row } from 'react-bootstrap';
import { SENSITIVE_PERMISSIONS, groupTitle } from '../roleRules';

const PermissionPicker = ({ groups, selected, onChange, canGrant, disabled }) => {
  const toggle = (name, checked) => onChange(checked ? [...selected, name] : selected.filter((p) => p !== name));

  // "Select all" only touches the permissions you're allowed to change.
  const toggleGroup = (permissions, checked) => {
    const changeable = permissions.filter((p) => canGrant(p.name)).map((p) => p.name);
    onChange(checked ? [...new Set([...selected, ...changeable])] : selected.filter((p) => !changeable.includes(p)));
  };

  return (
    <Row className="g-3">
      {Object.entries(groups).map(([groupKey, permissions]) => {
        const changeable = permissions.filter((p) => canGrant(p.name));
        const allOn = changeable.length > 0 && changeable.every((p) => selected.includes(p.name));

        return (
          <Col md={6} key={groupKey}>
            <div className="border rounded p-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">{groupTitle(groupKey)}</h6>
                {changeable.length > 1 && (
                  <Form.Check
                    type="switch"
                    id={`group-${groupKey}`}
                    label="All"
                    className="fs-13 mb-0"
                    checked={allOn}
                    disabled={disabled}
                    onChange={(e) => toggleGroup(permissions, e.target.checked)}
                  />
                )}
              </div>

              {permissions.map((permission) => {
                const locked = !canGrant(permission.name);
                return (
                  <Form.Check
                    key={permission.name}
                    id={`perm-${permission.name}`}
                    className="mb-1"
                    checked={selected.includes(permission.name)}
                    disabled={disabled || locked}
                    onChange={(e) => toggle(permission.name, e.target.checked)}
                    label={
                      <span>
                        {permission.label}{' '}
                        <code className="fs-11 text-muted">{permission.name}</code>
                        {SENSITIVE_PERMISSIONS.includes(permission.name) && (
                          <Badge bg="warning-subtle" text="warning" className="ms-1 fw-normal">
                            Needs approval
                          </Badge>
                        )}
                        {locked && <span className="text-muted fs-12 ms-1">(you don't have this)</span>}
                      </span>
                    }
                  />
                );
              })}
            </div>
          </Col>
        );
      })}
    </Row>
  );
};

export default PermissionPicker;
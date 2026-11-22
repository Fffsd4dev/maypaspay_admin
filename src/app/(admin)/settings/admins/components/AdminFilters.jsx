import { Col, Form, Row } from 'react-bootstrap';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'invited', label: 'Invited' },
  { value: 'suspended', label: 'Suspended' },
];

/** Search box + status and role filters for the admins list. */
const AdminFilters = ({ search, status, roleId, roles, onChange }) => (
  <Row className="g-2 mb-3">
    <Col md={6}>
      <Form.Control
        type="search"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => onChange({ search: e.target.value })}
        aria-label="Search admins"
      />
    </Col>
    <Col md={3}>
      <Form.Select value={status} onChange={(e) => onChange({ status: e.target.value })} aria-label="Filter by status">
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
    </Col>
    <Col md={3}>
      <Form.Select value={roleId} onChange={(e) => onChange({ roleId: e.target.value })} aria-label="Filter by role">
        <option value="">All roles</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.label}
          </option>
        ))}
      </Form.Select>
    </Col>
  </Row>
);

export default AdminFilters;

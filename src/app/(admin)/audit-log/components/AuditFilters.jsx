/**
 * Filters for the audit log. The common ones are always visible; the rest sit under "More filters".
 */
import { useState } from 'react';
import { Col, Collapse, Form, Row } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const MORE_FILTER_KEYS = ['actor_id', 'entity_type', 'entity_id', 'request_id'];

const AuditFilters = ({ filters, onChange, onReset, actionSuggestions }) => {
  const hasMoreFilters = MORE_FILTER_KEYS.some((key) => filters[key]);
  const [showMore, setShowMore] = useState(hasMoreFilters);
  const isFiltered = Object.values(filters).some(Boolean);

  const field = (key) => ({
    value: filters[key],
    onChange: (e) => onChange({ [key]: e.target.value }),
  });

  return (
    <div className="mb-3">
      <Row className="g-2 align-items-end">
        <Col sm={6} lg={2}>
          <Form.Label className="fs-13 text-muted mb-1" htmlFor="audit-from">From</Form.Label>
          <Form.Control id="audit-from" type="date" {...field('from')} max={filters.to || undefined} />
        </Col>
        <Col sm={6} lg={2}>
          <Form.Label className="fs-13 text-muted mb-1" htmlFor="audit-to">To</Form.Label>
          <Form.Control id="audit-to" type="date" {...field('to')} min={filters.from || undefined} />
        </Col>
        <Col sm={6} lg={4}>
          <Form.Label className="fs-13 text-muted mb-1" htmlFor="audit-action">Action</Form.Label>
          <div className="search-box">
            <IconifyIcon icon="tabler:search" className="search-icon" />
            <Form.Control id="audit-action" list="audit-action-options" placeholder="e.g. admin.login" {...field('action')} />
          </div>
          {/* Suggests action names already seen in the log */}
          <datalist id="audit-action-options">
            {actionSuggestions.map((action) => (
              <option key={action} value={action} />
            ))}
          </datalist>
        </Col>
        <Col sm={6} lg={2}>
          <Form.Label className="fs-13 text-muted mb-1" htmlFor="audit-actor-type">Done by</Form.Label>
          <Form.Select id="audit-actor-type" {...field('actor_type')}>
            <option value="">Anyone</option>
            <option value="admin">Admins</option>
            <option value="user">Users (customers)</option>
          </Form.Select>
        </Col>
        <Col lg={2} className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-subtle flex-grow-1"
            onClick={() => setShowMore((v) => !v)}
            aria-expanded={showMore}
            aria-controls="audit-more-filters"
          >
            <IconifyIcon icon="tabler:adjustments-horizontal" /> More filters
          </button>
        </Col>
      </Row>

      <Collapse in={showMore}>
        <div id="audit-more-filters">
          <Row className="g-2 pt-2">
            <Col sm={6} lg={2}>
              <Form.Label className="fs-13 text-muted mb-1" htmlFor="audit-actor-id">Actor ID</Form.Label>
              <Form.Control id="audit-actor-id" type="number" min="1" {...field('actor_id')} />
            </Col>
            <Col sm={6} lg={3}>
              <Form.Label className="fs-13 text-muted mb-1" htmlFor="audit-entity-type">Record type</Form.Label>
              <Form.Control id="audit-entity-type" placeholder="e.g. role" {...field('entity_type')} />
            </Col>
            <Col sm={6} lg={2}>
              <Form.Label className="fs-13 text-muted mb-1" htmlFor="audit-entity-id">Record ID</Form.Label>
              <Form.Control id="audit-entity-id" {...field('entity_id')} />
            </Col>
            <Col sm={6} lg={5}>
              <Form.Label className="fs-13 text-muted mb-1" htmlFor="audit-request-id">Request ID</Form.Label>
              <Form.Control id="audit-request-id" className="font-monospace" placeholder="From the X-Request-Id header" {...field('request_id')} />
            </Col>
          </Row>
        </div>
      </Collapse>

      {isFiltered && (
        <button type="button" className="btn btn-link btn-sm px-0 mt-2" onClick={onReset}>
          <IconifyIcon icon="tabler:x" /> Clear all filters
        </button>
      )}
    </div>
  );
};

export default AuditFilters;
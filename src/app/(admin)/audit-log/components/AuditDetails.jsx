/**
 * Side panel with everything recorded for one audit entry,
 * plus shortcuts to filter the log by the same actor, record or request.
 */
import { Offcanvas, Table } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { formatDateTime } from '@/utils/date';
import { compareStates, describeAction, describeActor, describeEntity, formatValue } from '../auditFormat';

const Detail = ({ label, children, mono }) => (
  <div className="d-flex justify-content-between gap-3 py-2 border-bottom border-light">
    <span className="text-muted text-nowrap">{label}</span>
    <span className={`text-end text-break ${mono ? 'font-monospace fs-13' : 'fw-medium'}`}>{children}</span>
  </div>
);

const AuditDetails = ({ entry, onClose, onFilter }) => {
  if (!entry) return null;

  const changes = compareStates(entry.before_state, entry.after_state);
  const entity = describeEntity(entry);

  // Apply a filter and close the panel, e.g. "everything this admin did".
  const filterBy = (filters) => {
    onFilter(filters);
    onClose();
  };

  return (
    <Offcanvas show onHide={onClose} placement="end" style={{ width: 460 }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title as="h5">
          {describeAction(entry.action)}
          <div className="fs-12 text-muted fw-normal font-monospace mt-1">{entry.action}</div>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Detail label="When">{formatDateTime(entry.created_at)}</Detail>
        <Detail label="Done by">
          {describeActor(entry)}
          {entry.actor_email && <span className="d-block text-muted fs-13 fw-normal">{entry.actor_email}</span>}
        </Detail>
        <Detail label="Record">{entity ?? '—'}</Detail>
        <Detail label="Reason">{entry.reason || '—'}</Detail>
        <Detail label="IP address" mono>{entry.ip_address ?? '—'}</Detail>
        <Detail label="Request ID" mono>{entry.request_id ?? '—'}</Detail>
        <Detail label="Entry ID" mono>{entry.id}</Detail>

        <h6 className="mt-4 mb-2">What changed</h6>
        {changes.length === 0 ? (
          <p className="text-muted fs-13">Nothing was recorded for this entry.</p>
        ) : (
          <div className="table-responsive">
            <Table size="sm" className="data-table fs-13">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Before</th>
                  <th>After</th>
                </tr>
              </thead>
              <tbody>
                {changes.map((row) => (
                  <tr key={row.field}>
                    <td className="fw-medium">{row.field}</td>
                    <td className={`text-break ${row.changed ? 'text-danger' : 'text-muted'}`}>{formatValue(row.before)}</td>
                    <td className={`text-break ${row.changed ? 'text-success fw-medium' : 'text-muted'}`}>{formatValue(row.after)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        <h6 className="mt-4 mb-2">Related entries</h6>
        <div className="d-grid gap-2">
          {entry.actor_type && (
            <button type="button" className="btn btn-outline-subtle btn-sm" onClick={() => filterBy({ actor_type: entry.actor_type, actor_id: String(entry.actor_id) })}>
              <IconifyIcon icon="tabler:user-search" /> Everything {describeActor(entry)} did
            </button>
          )}
          {entry.entity_type && (
            <button
              type="button"
              className="btn btn-outline-subtle btn-sm"
              onClick={() => filterBy({ entity_type: entry.entity_type, entity_id: entry.entity_id != null ? String(entry.entity_id) : '' })}
            >
              <IconifyIcon icon="tabler:history" /> History of {entity}
            </button>
          )}
          {entry.request_id && (
            <button type="button" className="btn btn-outline-subtle btn-sm" onClick={() => filterBy({ request_id: entry.request_id })}>
              <IconifyIcon icon="tabler:route" /> Everything in this request
            </button>
          )}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AuditDetails;
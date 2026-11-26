import { Table } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { formatDateTime } from '@/utils/date';
import { getInitials } from '@/utils/format';
import { describeAction, describeActor, describeEntity, isAdminActor } from '../auditFormat';

/** Who did it: avatar, name and email. The small badge tells staff and customers apart. */
const ActorCell = ({ entry }) => {
  if (!entry.actor_type) {
    return (
      <span className="status-pill status-pill-neutral">
        <IconifyIcon icon="tabler:settings-automation" /> System
      </span>
    );
  }
  const isAdmin = isAdminActor(entry);
  return (
    <div className="table-person">
      <span className="initials-avatar">{getInitials(describeActor(entry))}</span>
      <div>
        <div className="fw-semibold d-flex align-items-center gap-1">
          {describeActor(entry)}
          <IconifyIcon
            icon={isAdmin ? 'tabler:user-shield' : 'tabler:user'}
            className="text-muted"
            title={isAdmin ? 'Admin' : 'Customer'}
            aria-label={isAdmin ? 'Admin' : 'Customer'}
          />
        </div>
        {entry.actor_email && <div className="text-muted fs-13 text-break">{entry.actor_email}</div>}
      </div>
    </div>
  );
};

/** The audit entries. Clicking a row (or pressing Enter on it) opens its details. */
const AuditTable = ({ entries, onOpen }) => (
  <div className="table-responsive">
    <Table hover className="data-table align-middle">
      <thead>
        <tr>
          <th>When</th>
          <th>Action</th>
          <th>Done by</th>
          <th>Record</th>
          <th>IP address</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr
            key={entry.id}
            role="button"
            tabIndex={0}
            onClick={() => onOpen(entry)}
            onKeyDown={(e) => e.key === 'Enter' && onOpen(entry)}
            aria-label={`View details: ${describeAction(entry.action)}`}
          >
            <td className="text-nowrap">{formatDateTime(entry.created_at)}</td>
            <td>
              <div className="fw-semibold">{describeAction(entry.action)}</div>
              <code className="fs-12 text-muted">{entry.action}</code>
            </td>
            <td>
              <ActorCell entry={entry} />
            </td>
            <td className="text-muted">{describeEntity(entry) ?? '—'}</td>
            <td className="font-monospace fs-13 text-muted">{entry.ip_address ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);

export default AuditTable;
import { Table } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { formatDateTime } from '@/utils/date';
import { describeAction, describeActor, describeEntity } from '../auditFormat';

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
              {/* Neutral colour on purpose (red would read as an error); the icon tells admins and customers apart. */}
              <span className="status-pill status-pill-neutral">
                <IconifyIcon icon={entry.actor_type === 'admin' ? 'tabler:user-shield' : 'tabler:user'} /> {describeActor(entry)}
              </span>
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
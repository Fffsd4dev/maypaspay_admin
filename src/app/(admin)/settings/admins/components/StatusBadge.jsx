import { Badge } from 'react-bootstrap';

const STATUS_STYLES = {
  active: { bg: 'success', label: 'Active' },
  invited: { bg: 'warning', label: 'Invited' },
  suspended: { bg: 'danger', label: 'Suspended' },
};

/** Shows the admin's status, plus a "Locked" badge if they're locked out. */
const StatusBadge = ({ status, isLocked }) => {
  const style = STATUS_STYLES[status] ?? { bg: 'secondary', label: status };

  return (
    <span className="d-inline-flex gap-1">
      <Badge bg={`${style.bg}-subtle`} text={style.bg} className="fs-12">
        {style.label}
      </Badge>
      {isLocked && (
        <Badge bg="dark-subtle" text="dark" className="fs-12">
          Locked
        </Badge>
      )}
    </span>
  );
};

export default StatusBadge;

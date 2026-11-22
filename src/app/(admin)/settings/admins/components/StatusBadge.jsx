import IconifyIcon from '@/components/wrappers/IconifyIcon';

const STATUS_STYLES = {
  active: { variant: 'success', label: 'Active' },
  invited: { variant: 'warning', label: 'Invited' },
  suspended: { variant: 'danger', label: 'Suspended' },
};

/** The admin's status as a pill with a dot, plus a "Locked" pill if they're locked out. */
const StatusBadge = ({ status, isLocked }) => {
  const style = STATUS_STYLES[status] ?? { variant: 'neutral', label: status };

  return (
    <span className="d-inline-flex flex-wrap gap-1">
      <span className={`status-pill with-dot status-pill-${style.variant}`}>{style.label}</span>
      {isLocked && (
        <span className="status-pill status-pill-neutral">
          <IconifyIcon icon="tabler:lock" /> Locked
        </span>
      )}
    </span>
  );
};

export default StatusBadge;
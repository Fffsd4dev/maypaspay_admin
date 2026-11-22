import { Badge } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

/** A soft-coloured badge with an icon and label, e.g. ✓ Successful. `style` comes from statusStyles.js. */
const StatusPill = ({ style }) => (
  <Badge bg={`${style.variant}-subtle`} text={style.variant} className="d-inline-flex align-items-center gap-1 fw-medium fs-12">
    <IconifyIcon icon={style.icon} /> {style.label}
  </Badge>
);

export default StatusPill;
import IconifyIcon from '@/components/wrappers/IconifyIcon';

/** A soft-coloured pill with an icon and label, e.g. ✓ Successful. `style` comes from statusStyles.js. */
const StatusPill = ({ style }) => (
  <span className={`status-pill status-pill-${style.variant}`}>
    <IconifyIcon icon={style.icon} /> {style.label}
  </span>
);

export default StatusPill;
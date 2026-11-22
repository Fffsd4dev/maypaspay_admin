/**
 * A headline number with its change since yesterday.
 * `goodWhenUp={false}` flips the colours for numbers where going down is good (e.g. pending KYC).
 */
import { Card, CardBody } from 'react-bootstrap';
import DemoBadge from '@/components/DemoBadge';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { formatPercent } from '@/utils/format';

const StatCard = ({ label, value, current, previous, icon, goodWhenUp = true, isDemo }) => {
  const change = previous ? (current - previous) / previous : 0;
  const isUp = change >= 0;
  const isGood = isUp === goodWhenUp;

  return (
    <Card className="h-100">
      <CardBody>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="text-muted fw-medium">{label}</span>
          <span className="avatar-sm rounded bg-primary-subtle text-primary d-flex align-items-center justify-content-center">
            <IconifyIcon icon={icon} className="fs-20" />
          </span>
        </div>
        <h3 className="fw-semibold mb-2">{value}</h3>
        <div className="d-flex justify-content-between align-items-center">
          <span className="fs-13">
            <span className={`fw-semibold text-${isGood ? 'success' : 'danger'}`}>
              <IconifyIcon icon={isUp ? 'tabler:arrow-up-right' : 'tabler:arrow-down-right'} className="align-middle" />{' '}
              {formatPercent(Math.abs(change))}
            </span>{' '}
            <span className="text-muted">vs yesterday</span>
          </span>
          {isDemo && <DemoBadge />}
        </div>
      </CardBody>
    </Card>
  );
};

export default StatCard;
import { Card, CardBody } from 'react-bootstrap';
import DemoBadge from '@/components/DemoBadge';

/**
 * The frame every dashboard widget sits in: title, optional subtitle,
 * a "Demo data" badge while the widget uses sample data, and an optional slot on the right.
 */
const DashboardCard = ({ title, subtitle, isDemo, action, children, bodyClassName = '' }) => (
  <Card className="h-100">
    <CardBody className={`d-flex flex-column ${bodyClassName}`}>
      <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
        <div>
          <h5 className="mb-0 d-flex align-items-center gap-2">
            {title} {isDemo && <DemoBadge />}
          </h5>
          {subtitle && <p className="text-muted fs-13 mb-0 mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </CardBody>
  </Card>
);

export default DashboardCard;
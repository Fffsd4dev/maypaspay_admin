import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { complianceAlerts } from '../demoData';
import { ALERT_SEVERITY, timeAgo } from '../statusStyles';
import DashboardCard from './DashboardCard';

const ComplianceAlerts = () => (
  <DashboardCard title="Compliance alerts" subtitle={`${complianceAlerts.length} open, newest first`} isDemo>
    <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
      {complianceAlerts.map((alert) => {
        const style = ALERT_SEVERITY[alert.severity];
        return (
          <li key={alert.id} className="d-flex gap-2">
            <span className={`text-${style.variant} fs-20 lh-1`} aria-hidden="true">
              <IconifyIcon icon={style.icon} />
            </span>
            <div className="flex-grow-1">
              <div className="fw-medium">{alert.title}</div>
              <div className="text-muted fs-13">
                <span className={`text-${style.variant} fw-medium`}>{style.label}</span> · {alert.detail} · {timeAgo(alert.minutesAgo)}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  </DashboardCard>
);

export default ComplianceAlerts;
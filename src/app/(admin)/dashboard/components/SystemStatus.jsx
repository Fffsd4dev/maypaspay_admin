import { systemStatus } from '../demoData';
import { SERVICE_STATUS } from '../statusStyles';
import DashboardCard from './DashboardCard';
import StatusPill from './StatusPill';

const SystemStatus = () => {
  const allGood = systemStatus.every((service) => service.status === 'operational');

  return (
    <DashboardCard title="System status" subtitle={allGood ? 'All services operational' : 'Some services need attention'} isDemo>
      {systemStatus.map((service) => (
        <div key={service.name} className="d-flex justify-content-between align-items-center py-2 border-bottom border-light">
          <div>
            {service.name}
            {service.note && <div className="text-muted fs-12">{service.note}</div>}
          </div>
          <StatusPill style={SERVICE_STATUS[service.status]} />
        </div>
      ))}
    </DashboardCard>
  );
};

export default SystemStatus;
import { formatNumber } from '@/utils/format';
import { kycQueue } from '../demoData';
import DashboardCard from './DashboardCard';

const Row = ({ label, value, className = '' }) => (
  <div className="d-flex justify-content-between py-2 border-bottom border-light">
    <span className="text-muted">{label}</span>
    <span className={`fw-semibold ${className}`}>{formatNumber(value)}</span>
  </div>
);

const KycQueue = () => (
  <DashboardCard title="KYC review queue" subtitle={`Oldest submission waiting ${kycQueue.oldestWaitingHours} h`} isDemo>
    <Row label="Awaiting review" value={kycQueue.awaitingReview} />
    <Row label="In review" value={kycQueue.inReview} />
    <Row label="Approved today" value={kycQueue.approvedToday} className="text-success" />
    <Row label="Rejected today" value={kycQueue.rejectedToday} className="text-danger" />
  </DashboardCard>
);

export default KycQueue;
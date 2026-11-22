/**
 * Staff account counts — REAL data from the Admins API (no demo badge).
 */
import { Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatNumber } from '@/utils/format';
import useStaffSummary from '../useStaffSummary';
import DashboardCard from './DashboardCard';

const ITEMS = [
  { key: 'active', label: 'Active', className: 'text-success' },
  { key: 'invited', label: 'Invited, not accepted yet', className: 'text-warning' },
  { key: 'suspended', label: 'Suspended', className: 'text-danger' },
];

const StaffSummary = () => {
  const { counts, loading, error } = useStaffSummary();

  return (
    <DashboardCard
      title="Staff accounts"
      subtitle="Admins with access to this dashboard"
      action={<Link to="/settings/admins" className="fs-13">Manage</Link>}
    >
      {loading && (
        <div className="text-center py-3">
          <Spinner size="sm" />
        </div>
      )}
      {error && <p className="text-muted mb-0">{error}</p>}
      {counts &&
        ITEMS.map((item) => (
          <div key={item.key} className="d-flex justify-content-between py-2 border-bottom border-light">
            <span className="text-muted">{item.label}</span>
            <span className={`fw-semibold ${item.className}`}>{formatNumber(counts[item.key])}</span>
          </div>
        ))}
    </DashboardCard>
  );
};

export default StaffSummary;
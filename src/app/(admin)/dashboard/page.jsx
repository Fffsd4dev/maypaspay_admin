/**
 * Dashboard: an overview of the platform.
 *
 * Each widget only appears for admins with the permission for that area.
 * Widgets marked "Demo data" use sample numbers from demoData.js until their API is ready.
 */
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import PageTitle from '@/components/PageTitle';
import { useAuthContext } from '@/context/useAuthContext';
import { formatMoney, formatNumber } from '@/utils/format';
import ChannelChart from './components/ChannelChart';
import ComplianceAlerts from './components/ComplianceAlerts';
import KycQueue from './components/KycQueue';
import RecentTransactions from './components/RecentTransactions';
import StaffSummary from './components/StaffSummary';
import StatCard from './components/StatCard';
import SystemStatus from './components/SystemStatus';
import VolumeChart from './components/VolumeChart';
import { todayStats } from './demoData';

const DashboardPage = () => {
  const { admin, hasPermission } = useAuthContext();

  const canSeeOperations = hasPermission('ops.view');
  const canSeeUsers = hasPermission('users.view');
  const canSeeKyc = hasPermission('kyc.view');
  const canSeeCompliance = hasPermission('compliance.view');
  const canManageAdmins = hasPermission('settings.admins');

  const stats = [
    canSeeOperations && {
      key: 'volume',
      label: 'Volume today',
      value: formatMoney(todayStats.volume.today, { compact: true }),
      icon: 'tabler:cash',
      ...todayStats.volume,
    },
    canSeeOperations && {
      key: 'transactions',
      label: 'Transactions today',
      value: formatNumber(todayStats.transactions.today),
      icon: 'tabler:arrows-exchange',
      ...todayStats.transactions,
    },
    canSeeUsers && {
      key: 'customers',
      label: 'Active customers',
      value: formatNumber(todayStats.activeCustomers.today),
      icon: 'tabler:users-group',
      ...todayStats.activeCustomers,
    },
    canSeeKyc && {
      key: 'kyc',
      label: 'Pending KYC',
      value: formatNumber(todayStats.pendingKyc.today),
      icon: 'tabler:id-badge-2',
      goodWhenUp: false, // fewer pending is better
      ...todayStats.pendingKyc,
    },
  ].filter(Boolean);

  const hasAnyWidget = stats.length > 0 || canSeeCompliance || canManageAdmins;

  return (
    <>
      <PageTitle title="Dashboard" />

      <div className="mb-3">
        <h4 className="mb-1">Welcome back, {admin?.name?.split(' ')[0]}</h4>
        <p className="text-muted mb-0">Here's what's happening on MaypasPay today.</p>
      </div>

      {stats.length > 0 && (
        <Row className="g-3 mb-3">
          {stats.map(({ key, today, yesterday, ...stat }) => (
            <Col key={key} sm={6} xl={3}>
              <StatCard {...stat} current={today} previous={yesterday} isDemo />
            </Col>
          ))}
        </Row>
      )}

      {canSeeOperations && (
        <Row className="g-3 mb-3">
          <Col xl={8}>
            <VolumeChart />
          </Col>
          <Col xl={4}>
            <ChannelChart />
          </Col>
        </Row>
      )}

      {(canSeeOperations || canSeeCompliance) && (
        <Row className="g-3 mb-3">
          {canSeeOperations && (
            <Col xl={canSeeCompliance ? 8 : 12}>
              <RecentTransactions />
            </Col>
          )}
          {canSeeCompliance && (
            <Col xl={canSeeOperations ? 4 : 6}>
              <ComplianceAlerts />
            </Col>
          )}
        </Row>
      )}

      <Row className="g-3 mb-3">
        {canSeeKyc && (
          <Col md={6} xl={4}>
            <KycQueue />
          </Col>
        )}
        {canManageAdmins && (
          <Col md={6} xl={4}>
            <StaffSummary />
          </Col>
        )}
        {canSeeOperations && (
          <Col md={6} xl={4}>
            <SystemStatus />
          </Col>
        )}
      </Row>

      {!hasAnyWidget && (
        <Card>
          <CardBody className="text-center text-muted py-5">
            Your role doesn't include any dashboard widgets yet. Use the menu to get to your work.
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default DashboardPage;
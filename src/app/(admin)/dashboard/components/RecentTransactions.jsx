import { Table } from 'react-bootstrap';
import { formatMoney } from '@/utils/format';
import { recentTransactions } from '../demoData';
import { TRANSACTION_STATUS, timeAgo } from '../statusStyles';
import DashboardCard from './DashboardCard';
import StatusPill from './StatusPill';

const RecentTransactions = () => (
  <DashboardCard title="Recent transactions" subtitle="Latest activity across all channels" isDemo>
    <div className="table-responsive">
      <Table hover className="align-middle mb-0 table-sm">
        <thead className="bg-light bg-opacity-50">
          <tr>
            <th>Reference</th>
            <th>Customer</th>
            <th>Type</th>
            <th className="text-end">Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {recentTransactions.map((tx) => (
            <tr key={tx.reference}>
              <td>
                <span className="font-monospace fs-13">{tx.reference}</span>
                <div className="text-muted fs-12">{timeAgo(tx.minutesAgo)}</div>
              </td>
              <td>{tx.customer}</td>
              <td>
                {tx.type}
                <div className="text-muted fs-12">{tx.channel}</div>
              </td>
              <td className="text-end fw-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {formatMoney(tx.amount)}
              </td>
              <td>
                <StatusPill style={TRANSACTION_STATUS[tx.status]} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  </DashboardCard>
);

export default RecentTransactions;
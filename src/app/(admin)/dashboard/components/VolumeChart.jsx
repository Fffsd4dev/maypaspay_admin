/**
 * Deposits vs withdrawals over time (line chart), with a 7 / 30 / 90 day switch.
 */
import { useMemo, useState } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatMoney } from '@/utils/format';
import useChartTheme from '../chartTheme';
import { dailyVolume } from '../demoData';
import DashboardCard from './DashboardCard';

const PERIODS = [7, 30, 90];

const formatDay = (isoDate) => new Date(isoDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card shadow-sm border p-2 mb-0 fs-13">
      <div className="fw-semibold mb-1">{formatDay(label)}</div>
      {payload.map((item) => (
        <div key={item.dataKey} className="d-flex align-items-center gap-2">
          <span style={{ width: 10, height: 2, background: item.color, display: 'inline-block' }} />
          <span className="text-muted">{item.name}</span>
          <span className="ms-auto fw-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>{formatMoney(item.value)}</span>
        </div>
      ))}
    </div>
  );
};

const VolumeChart = () => {
  const [days, setDays] = useState(30);
  const theme = useChartTheme();
  const data = useMemo(() => dailyVolume.slice(-days), [days]);

  const periodSwitch = (
    <ButtonGroup size="sm" aria-label="Time period">
      {PERIODS.map((period) => (
        <Button key={period} variant={period === days ? 'primary' : 'light'} onClick={() => setDays(period)}>
          {period}d
        </Button>
      ))}
    </ButtonGroup>
  );

  return (
    <DashboardCard title="Transaction volume" subtitle="Deposits and withdrawals per day (NGN)" isDemo action={periodSwitch}>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={theme.grid} vertical={false} />
            <XAxis dataKey="date" tickFormatter={formatDay} stroke={theme.axis} tickLine={false} axisLine={false} fontSize={12} minTickGap={24} />
            <YAxis tickFormatter={(v) => formatMoney(v, { compact: true })} stroke={theme.axis} tickLine={false} axisLine={false} fontSize={12} width={70} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: theme.axis, strokeDasharray: '3 3' }} />
            <Legend
              verticalAlign="top"
              align="left"
              height={32}
              iconType="plainline"
              wrapperStyle={{ fontSize: 13 }}
              formatter={(value) => <span className="text-body">{value}</span>} // text stays text-coloured; the line shows the series colour
            />
            <Line type="monotone" dataKey="deposits" name="Deposits" stroke={theme.series[0]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="withdrawals" name="Withdrawals" stroke={theme.series[1]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default VolumeChart;
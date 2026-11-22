/**
 * Today's volume by payment channel (horizontal bars, one colour because it's one measure).
 */
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatMoney } from '@/utils/format';
import useChartTheme from '../chartTheme';
import { volumeByChannel } from '../demoData';
import DashboardCard from './DashboardCard';

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { channel, volume } = payload[0].payload;
  return (
    <div className="card shadow-sm border p-2 mb-0 fs-13">
      <span className="text-muted">{channel}</span> <span className="fw-medium">{formatMoney(volume)}</span>
    </div>
  );
};

const ChannelChart = () => {
  const theme = useChartTheme();

  return (
    <DashboardCard title="Volume by channel" subtitle="Today (NGN)" isDemo>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={volumeByChannel} layout="vertical" margin={{ top: 0, right: 56, left: 0, bottom: 0 }} barCategoryGap={14}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="channel" stroke={theme.axis} tickLine={false} axisLine={false} fontSize={12} width={96} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: theme.cursor }} />
            <Bar dataKey="volume" fill={theme.series[0]} radius={[0, 4, 4, 0]}>
              <LabelList dataKey="volume" position="right" offset={8} formatter={(v) => formatMoney(v, { compact: true })} fontSize={12} fill="currentColor" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default ChannelChart;
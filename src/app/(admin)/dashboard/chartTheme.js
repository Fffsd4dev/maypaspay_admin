/**
 * Colours for charts, in light and dark mode.
 * Series colours are colour-blind-safe and were checked against both backgrounds.
 * Charts should use these instead of hard-coding hex values.
 */
import { useLayoutContext } from '@/context/useLayoutContext';

const LIGHT = {
  series: ['#2a78d6', '#eb6834'], // 1: blue, 2: orange (always in this order)
  grid: '#e1e0d9',
  axis: '#898781',
  cursor: 'rgba(11, 11, 11, 0.05)',
};

const DARK = {
  series: ['#3987e5', '#d95926'],
  grid: '#2c2c2a',
  axis: '#898781',
  cursor: 'rgba(255, 255, 255, 0.06)',
};

export default function useChartTheme() {
  const { themeMode } = useLayoutContext();
  return themeMode === 'dark' ? DARK : LIGHT;
}
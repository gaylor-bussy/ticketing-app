import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';



export default function Graphique() {
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Decembre',

];

export default function BiaxialLineChart() {
  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <LineChart
        series={[
          { data: pData, label: 'pv', yAxisId: 'leftAxisId' },
          { data: uData, label: 'uv', yAxisId: 'rightAxisId' },
        ]}
        xAxis={[{ scaleType: 'point', data: xLabels, height: 28 }]}
        yAxis={[
          { id: 'leftAxisId', width: 50 },
          { id: 'rightAxisId', position: 'right' },
        ]}
      />
    </Box>
  );
}


















}
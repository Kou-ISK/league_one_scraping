import { Cell, Legend, Pie, PieChart } from 'recharts';
import { ScoreInfo } from '../types/scoreInfo';
import './conversionSuccessRatePieChart.css';
import { getPhotoUrl } from '../utils/rankingUtils';

interface ConversionSuccessRatePieChartProps {
  scoreProgress: ScoreInfo[];
}
export const ConversionSuccessRatePieChart = (
  props: ConversionSuccessRatePieChartProps
) => {
  const allConversion = props.scoreProgress.filter(
    (value) => value.score_type === 'G' || value.score_type === 'Gx'
  );

  const players = Array.from(
    new Set(allConversion.map((item) => item.player_name))
  );

  return (
    <div className='pie-container'>
      {players.map((player) => {
        const playerData = allConversion.filter(
          (value) => value.player_name === player
        );
        const counts = {
          G: playerData.filter((value) => value.score_type === 'G').length,
          Gx: playerData.filter((value) => value.score_type === 'Gx').length,
        };

        const data = [
          { name: '成功', value: counts.G },
          { name: '失敗', value: counts.Gx },
        ];

        return (
          <div key={player} className='player'>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={getPhotoUrl(player as string).teamLogo}
                alt=''
                height='30px'
              />
              <h1 className='player-name'>{player}</h1>
            </div>
            <PieChart width={200} height={250}>
              <Pie
                data={data}
                dataKey='value'
                cx='50%'
                cy='50%'
                outerRadius={50}
                fill='#82ca9d'
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </div>
        );
      })}
    </div>
  );
};

// score_type に対応する色を返す関数
const getColor = (scoreType: string) => {
  return scoreType === '成功' ? '#8884d8' : '#82ca9d';
};

import { Paper } from '@mui/material';
import { ScoreInfo } from '../types/scoreInfo';
import './scoreGraph.css';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TEAM_MASTER_DATA } from '../variables';
import { parseScoreTypeName } from '../utils/rankingUtils';

interface ScoreGraphProps {
  homeTeamName: string;
  awayTeamName: string;
  scoreProgress: ScoreInfo[];
}

export const ScoreGraph = (props: ScoreGraphProps) => {
  const homeTeamColor = TEAM_MASTER_DATA.find(
    (master) => master.team_name === props.homeTeamName
  )?.color;
  const awayTeamColor = TEAM_MASTER_DATA.find(
    (master) => master.team_name === props.awayTeamName
  )?.color;
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper className='custom-tooltip'>
          <p className='score-type'>{`${parseScoreTypeName(
            payload[0].payload.score_type
          )}`}</p>
          <p className='scorer'>{`Scorer: ${payload[0].payload.player_name}`}</p>
          <div className='current-score'>
            <p
              className='home-team-score'
              color={homeTeamColor}
            >{`${payload[0].payload.home_team_score}`}</p>
            <p>- </p>
            <p
              className='away-team-score'
              color={awayTeamColor}
            >{`${payload[0].payload.away_team_score}`}</p>
          </div>
        </Paper>
      );
    }
    return null;
  };
  const lastData = props.scoreProgress[
    props.scoreProgress.length - 1
  ] as ScoreInfo;
  const yAxisDataKey: string =
    lastData.home_team_score >= lastData.away_team_score
      ? 'home_team_score'
      : 'away_team_score';
  return (
    <LineChart
      width={700}
      height={300}
      data={props.scoreProgress}
      margin={{
        top: 5,
        right: 5,
        left: 5,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='time' />
      <YAxis dataKey={yAxisDataKey} />
      <Line
        type='monotone'
        dataKey='home_team_score'
        name={props.homeTeamName}
        stroke={homeTeamColor}
      />
      <Line
        type='monotone'
        dataKey='away_team_score'
        name={props.awayTeamName}
        stroke={awayTeamColor}
      />
      <Legend />
      <Tooltip content={<CustomTooltip />} />
    </LineChart>
  );
};

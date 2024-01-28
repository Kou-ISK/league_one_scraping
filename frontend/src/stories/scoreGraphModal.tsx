import Modal from 'react-modal';
import { ScoreInfo } from '../types/scoreInfo';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Dispatch } from 'react';
import { Paper } from '@mui/material';
import './scoreGraphModal.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '40%',
  },
};

interface ScoreGraphModalProps {
  showScoreGraphModal: boolean;
  setShowScoreGraphModal: Dispatch<React.SetStateAction<boolean>>;
  homeTeamName: string;
  awayTeamName: string;
  scoreProgress: ScoreInfo[];
}

enum ScoreTypes {
  T = 'トライ',
  PG = 'ペナルティゴール成功',
  DG = 'ドロップゴール成功',
  G = 'コンバージョン成功',
  Gx = 'コンバージョン失敗',
}

const parseScoreTypeName = (scoreType: string): string => {
  return ScoreTypes[scoreType as keyof typeof ScoreTypes] || scoreType;
};

export const ScoreGraphModal = (props: ScoreGraphModalProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper className='custom-tooltip'>
          <p className='score-type'>{`${parseScoreTypeName(
            payload[0].payload.score_type
          )}`}</p>
          <p className='scorer'>{`Scorer: ${payload[0].payload.player_name}`}</p>
          <div className='current-score'>
            <p className='home-team-score'>{`${payload[0].payload.home_team_score}`}</p>
            <p>- </p>
            <p className='away-team-score'>{`${payload[0].payload.away_team_score}`}</p>
          </div>
        </Paper>
      );
    }
    return null;
  };
  const lastData = props.scoreProgress.pop() as ScoreInfo;
  const yAxisDataKey: string =
    lastData.home_team_score >= lastData.away_team_score
      ? 'home_team_score'
      : 'away_team_score';
  return (
    <>
      <Modal
        isOpen={props.showScoreGraphModal}
        style={customStyles}
        onRequestClose={() =>
          props.setShowScoreGraphModal(!props.showScoreGraphModal)
        }
      >
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
            stroke='#3ba2f6'
          />
          <Line
            type='monotone'
            dataKey='away_team_score'
            name={props.awayTeamName}
            stroke='#8884d8'
          />
          <Legend />
          <Tooltip content={<CustomTooltip />} />
        </LineChart>
      </Modal>
    </>
  );
};

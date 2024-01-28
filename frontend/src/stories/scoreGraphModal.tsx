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

export const ScoreGraphModal = (props: ScoreGraphModalProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper className='custom-tooltip'>
          <p className='score-type'>{`Score Type: ${payload[0].payload.score_type}`}</p>
        </Paper>
      );
    }

    return null;
  };
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
          <YAxis dataKey='home_team_score' />
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

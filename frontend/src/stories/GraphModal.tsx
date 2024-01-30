import Modal from 'react-modal';
import { Dispatch, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import { ScoreGraph } from './scoreGraph';
import { Game } from '../types/game';
import { ConversionSuccessRatePieChart } from './conversionSuccessRatePieChart';

const customStyles = {
  content: {
    width: '80vw',
    height: '70vh',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '40%',
    overflow: 'scroll',
  },
};

interface ScoreGraphModalProps {
  showGraphModal: boolean;
  setShowGraphModal: Dispatch<React.SetStateAction<boolean>>;
  game: Game;
}

export const GraphModal = (props: ScoreGraphModalProps) => {
  const [selectedGraphType, setSelectedGraphType] = useState('scoreProgress');
  const handleChange = (event: React.ChangeEvent<{}>, value: string) => {
    setSelectedGraphType(value);
  };

  return (
    <>
      <Modal
        isOpen={props.showGraphModal}
        style={customStyles}
        onRequestClose={() => props.setShowGraphModal(!props.showGraphModal)}
      >
        <Tabs
          value={selectedGraphType}
          onChange={handleChange}
          indicatorColor='primary'
          textColor='primary'
          centered
        >
          <Tab label='得点経過' value={'scoreProgress'} />
          <Tab
            label='コンバージョンキック成功率'
            value={'conversionSuccessRate'}
          />
        </Tabs>
        {selectedGraphType === 'scoreProgress' && (
          <ScoreGraph
            scoreProgress={props.game.score_progress}
            homeTeamName={props.game.home_team}
            awayTeamName={props.game.away_team}
          />
        )}
        {selectedGraphType === 'conversionSuccessRate' && (
          <ConversionSuccessRatePieChart
            scoreProgress={props.game.score_progress}
          />
        )}
      </Modal>
    </>
  );
};

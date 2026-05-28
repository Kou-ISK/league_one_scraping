import Modal from 'react-modal';
import { Dispatch, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import { ScoreGraph } from './scoreGraph';
import { Game } from '../types/game';
import { ConversionSuccessRatePieChart } from './conversionSuccessRatePieChart';
import { ScoreProgressTimeline } from './ScoreProgressTimeline';

const customStyles = {
  content: {
    width: 'min(1120px, 92vw)',
    height: 'min(760px, 82vh)',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: '0',
    borderRadius: '8px',
    boxShadow: '0 24px 70px rgba(24, 33, 36, 0.24)',
    minWidth: '40%',
    overflow: 'auto',
    padding: '20px',
  },
  overlay: {
    backgroundColor: 'rgba(24, 33, 36, 0.42)',
    zIndex: 100,
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
        <div className='modal-heading'>
          <h2>試合グラフ</h2>
          <button type='button' onClick={() => props.setShowGraphModal(false)}>
            Close
          </button>
        </div>
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
          <div className='score-modal-grid'>
            <ScoreGraph
              scoreProgress={props.game.score_progress}
              homeTeamName={props.game.home_team}
              awayTeamName={props.game.away_team}
            />
            <ScoreProgressTimeline
              scoreProgress={props.game.score_progress}
              homeTeamName={props.game.home_team}
              awayTeamName={props.game.away_team}
            />
          </div>
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

import { Box, Modal } from '@mui/material';
import { Game } from '../types/game';
import { PlayerObjectList } from './playerObjectList';
import { Dispatch } from 'react';
import './gameInfoModal.css';

const style = {
  maxHeight: '95vh',
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  overflow: 'scroll',
};

interface gameInfoModalProps {
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  game: Game;
}
export const GameInfoModal = (props: gameInfoModalProps) => {
  const game = props.game;
  return (
    <>
      <Modal
        open={props.open}
        onClose={() => props.setOpen(!props.open)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <h1>{game.basic_info}</h1>
          <p>{game.date}</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ margin: '10px' }}>
              <h2>{game.home_team}</h2>
              <PlayerObjectList playerList={game.home_team_player_list} />
            </div>
            <div style={{ margin: '10px' }}>
              <h2>{game.away_team}</h2>
              <PlayerObjectList playerList={game.away_team_player_list} />
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

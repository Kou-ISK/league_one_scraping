import { Game } from '../types/game';
import { PlayerObjectList } from './playerObjectList';
import './gameDetailPage.css';
import { useParams } from 'react-router-dom';
import { Button } from './Button';
import { useState } from 'react';
import { GraphModal } from './GraphModal';
import { ALL_GAME } from '../variables';

export const GameDetailPage = () => {
  const param = useParams();
  const game = ALL_GAME.find((game) => game.id === Number(param.id)) as Game;
  const [showGraphModal, setShowGraphModal] = useState(false);

  return (
    <div className='page'>
      <h1>{game.basic_info}</h1>
      <h2>{game.date}</h2>
      <h2>レフェリー: {game.referee_name}</h2>
      <h2>天気: {game.weather}</h2>
      <h2>観客動員数: {game.spectator}</h2>
      <div className='show-graph'>
        <Button
          label='各種グラフを表示'
          primary={true}
          onClick={() => setShowGraphModal(true)}
        />
      </div>
      <h3 className='score'>
        {game.home_team_score} - {game.away_team_score}
      </h3>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ margin: '10px' }}>
          <h2>{game.home_team}</h2>
          <PlayerObjectList
            playerList={game.home_team_player_list}
            replacementList={[
              ...game.home_team_replacement_list,
              ...game.home_team_temporary_replacement_list,
            ]}
          />
        </div>
        <div style={{ margin: '10px' }}>
          <h2>{game.away_team}</h2>
          <PlayerObjectList
            playerList={game.away_team_player_list}
            replacementList={[
              ...game.away_team_replacement_list,
              ...game.away_team_temporary_replacement_list,
            ]}
          />
        </div>
      </div>
      {showGraphModal && (
        <GraphModal
          showGraphModal={showGraphModal}
          setShowGraphModal={setShowGraphModal}
          game={game}
        />
      )}
    </div>
  );
};

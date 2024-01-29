import { Game } from '../types/game';
import { PlayerObjectList } from './playerObjectList';
import './gameDetailPage.css';
import { useParams } from 'react-router-dom';
import { allGame } from '../App';
import { Button } from './Button';
import { useState } from 'react';
import { GraphModal } from './GraphModal';

export const GameDetailPage = () => {
  const param = useParams();
  const game = allGame.find((game) => game.id === Number(param.id)) as Game;
  const [showGraphModal, setShowGraphModal] = useState(false);

  return (
    <>
      <h1>{game.basic_info}</h1>
      <h2>{game.date}</h2>
      <p>レフェリー: {game.referee_name}</p>
      <p>天気: {game.weather}</p>
      <p>観客動員数: {game.spectator}</p>
      <Button
        label='各種グラフを表示'
        primary={true}
        onClick={() => setShowGraphModal(true)}
      />
      <h3 className='score'>
        {game.home_team_score} - {game.away_team_score}
      </h3>
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
      {showGraphModal && (
        <GraphModal
          showGraphModal={showGraphModal}
          setShowGraphModal={setShowGraphModal}
          game={game}
        />
      )}
    </>
  );
};

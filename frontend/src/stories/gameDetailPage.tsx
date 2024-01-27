import { Game } from '../types/game';
import { PlayerObjectList } from './playerObjectList';
import './gameDetailPage.css';
import { useParams } from 'react-router-dom';
import { allGame } from '../App';
import { Button } from './Button';
import { useState } from 'react';

export const GameDetailPage = () => {
  const param = useParams();
  const game = allGame.find((game) => game.id === Number(param.id)) as Game;
  const [showGraphModal, setShowGraphModal] = useState(false);

  return (
    <>
      <h1>{game.basic_info}</h1>
      <h2>{game.date}</h2>
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
      <Button
        label='得点経過グラフを表示'
        primary={true}
        onClick={() => setShowGraphModal(true)}
      />
    </>
  );
};

import { Game } from '../types/game';
import { PlayerObjectList } from './playerObjectList';
import './gameDetailPage.css';
import { useParams } from 'react-router-dom';
import { allGame } from '../App';
import { Button } from './Button';
import { useState } from 'react';
import { ScoreGraphModal } from './scoreGraphModal';

export const GameDetailPage = () => {
  const param = useParams();
  const game = allGame.find((game) => game.id === Number(param.id)) as Game;
  const [showScoreGraphModal, setShowScoreGraphModal] = useState(false);

  return (
    <>
      <h1>{game.basic_info}</h1>
      <h2>{game.date}</h2>
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
      <Button
        label='得点経過グラフを表示'
        primary={true}
        onClick={() => setShowScoreGraphModal(true)}
      />
      {showScoreGraphModal && (
        <ScoreGraphModal
          showScoreGraphModal={showScoreGraphModal}
          setShowScoreGraphModal={setShowScoreGraphModal}
          scoreProgress={game.score_progress}
          homeTeamName={game.home_team}
          awayTeamName={game.away_team}
        />
      )}
    </>
  );
};

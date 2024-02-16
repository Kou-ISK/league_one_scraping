import React from 'react';
import { Game } from '../types/game';
import './spectatorPage.css';

interface SpectatorPageProps {
  year: number;
  selectedGameList: Game[];
}

export const SpectatorPage: React.FC<SpectatorPageProps> = (props) => {
  // divisionごとに試合データを分類
  const gamesByDivision: { [key: number]: Game[] } = {};
  props.selectedGameList.forEach((game) => {
    if (!gamesByDivision[game.division ? game.division : 0]) {
      gamesByDivision[game.division ? game.division : 0] = [];
    }
    gamesByDivision[game.division ? game.division : 0].push(game);
  });

  // ディビジョンごとにテーブルをレンダリング
  return (
    <div style={{ maxWidth: '100vw', margin: '15px' }}>
      {Object.entries(gamesByDivision).map(([division, games]) => (
        <div key={division} style={{ overflow: 'scroll' }}>
          <h3 className='division-title'>
            {division.toString() === '0'
              ? '入れ替え戦/プレーオフ'
              : 'Div.' + division}
          </h3>
          <table className='sticky-table'>
            <thead style={{ backgroundColor: 'lightgray' }}>
              <tr>
                <th
                  style={{ minWidth: '300px', backgroundColor: 'lightgray' }}
                  className='sticky-col'
                >
                  チーム名
                </th>
                {getUniqueDates(games).map((date) => (
                  <th key={date} style={{ minWidth: '100px' }}>
                    {formatDate(date)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from(new Set(games.map((game) => game.home_team))).map(
                (team) => (
                  <tr key={team}>
                    <td className='sticky-col'>{team}</td>
                    {getUniqueDates(games).map((date) => (
                      <td key={date}>
                        {games
                          .filter(
                            (game) =>
                              game.date === date && game.home_team === team
                          )
                          .map((game) => game.spectator)
                          .join(', ')}
                      </td>
                    ))}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

// MM/DD形式の日付を返す関数
const formatDate = (date: string) => {
  const [, month, day] = date.split('/');
  return `${month}/${day}`;
};

// 日付データの重複を取り除く関数
const getUniqueDates = (games: Game[]) => {
  const dateSet = new Set<string>();
  games.forEach((game) => {
    dateSet.add(game.date);
  });
  return Array.from(dateSet);
};

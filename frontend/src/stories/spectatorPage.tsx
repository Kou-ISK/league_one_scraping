import React from 'react';
import Link from 'next/link';
import { Game } from '../types/game';
import { TEAM_MASTER_DATA } from '../variables';
import { SectionPanel } from '../components/molecules/SectionPanel';

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
    <div className='spectator-page'>
      {Object.entries(gamesByDivision).map(([division, games]) => (
        <SectionPanel
          key={division}
          title={division.toString() === '0' ? '入れ替え戦/プレーオフ' : `Div.${division}`}
          meta={`${games.length} matches`}
        >
          <div className='table-scroll'>
          <table className='sticky-table spectator-table'>
            <thead>
              <tr>
                <th className='sticky-col'>チーム名</th>
                {getUniqueDates(games).map((date) => (
                  <th key={date}>
                    {formatDate(date)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from(new Set(games.map((game) => game.home_team))).map(
                (team) => (
                  <tr key={team}>
                    <td className='sticky-col'>
                      <div className='team-cell'>
                        <img
                          src={
                            TEAM_MASTER_DATA.find(
                              (master) => master.team_name === team
                            )?.logo_url
                          }
                          alt=''
                          className='team-cell-logo'
                        />
                        <p>{team}</p>
                      </div>
                    </td>
                    {getUniqueDates(games).map((date) => {
                      const matchedGames = getGameByDateAndHomeTeam(games, date, team);
                      const firstGame = matchedGames[0];
                      return (
                        <td key={date}>
                          {firstGame ? (
                            <Link href={`/game/${firstGame.id}`}>
                              {matchedGames.map((game) => game.spectator).join(', ')}
                            </Link>
                          ) : (
                            '-'
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )
              )}
            </tbody>
          </table>
          </div>
        </SectionPanel>
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

const getGameByDateAndHomeTeam = (
  games: Game[],
  date: string,
  team: string
) => {
  return games.filter((game) => game.date === date && game.home_team === team);
};

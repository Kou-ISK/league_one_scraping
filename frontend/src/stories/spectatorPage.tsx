import React from 'react';
import Link from 'next/link';
import { TEAM_MASTER_DATA } from '../variables';
import { SectionPanel } from '../components/molecules/SectionPanel';

export type SpectatorMatch = {
  id: string;
  division: number;
  date: string;
  homeTeam: string;
  awayTeam: string;
  spectator: string | null;
  venue?: string;
  matchUrl?: string;
};

interface SpectatorPageProps {
  year: number;
  matches: SpectatorMatch[];
}

export const SpectatorPage: React.FC<SpectatorPageProps> = (props) => {
  const gamesByDivision: { [key: number]: SpectatorMatch[] } = {};
  props.matches.forEach((game) => {
    if (!gamesByDivision[game.division || 0]) {
      gamesByDivision[game.division || 0] = [];
    }
    gamesByDivision[game.division || 0].push(game);
  });

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
                    <th key={date}>{formatDate(date)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from(new Set(games.map((game) => game.homeTeam))).map((team) => (
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
                            {firstGame?.matchUrl ? (
                              <a href={firstGame.matchUrl} target='_blank' rel='noreferrer'>
                                {formatSpectatorValue(matchedGames)}
                              </a>
                            ) : firstGame ? (
                              <Link href={`/game/${firstGame.id}`}>
                                {formatSpectatorValue(matchedGames)}
                              </Link>
                            ) : (
                              '-'
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </SectionPanel>
      ))}
    </div>
  );
};

const formatDate = (date: string) => {
  const parts = date.split('/');
  if (parts.length >= 3) return `${parts[1]}/${parts[2].slice(0, 2)}`;
  return date;
};

const getUniqueDates = (games: SpectatorMatch[]) => {
  const dateSet = new Set<string>();
  games.forEach((game) => {
    dateSet.add(game.date);
  });
  return Array.from(dateSet);
};

const getGameByDateAndHomeTeam = (
  games: SpectatorMatch[],
  date: string,
  team: string
) => {
  return games.filter((game) => game.date === date && game.homeTeam === team);
};

const formatSpectatorValue = (games: SpectatorMatch[]) => {
  const values = games.map((game) => game.spectator || 'N/A');
  return values.join(', ');
};

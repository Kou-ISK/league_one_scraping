import React, { Dispatch, useState } from 'react';

import './page.css';
import { GameInfoTable } from './gameInfoTable';
import { Game } from '../types/game';
import { YearSelectionTabs } from './yearSelectionTabs';
import { RankingPage } from './rankingPage';
import { Button } from './Button';
import { SpectatorPage } from './spectatorPage';
import { DATA_SET } from '../variables';

interface PageProps {
  selectedGameList: Game[];
  setSelectedGameList: Dispatch<React.SetStateAction<Game[]>>;
}

export const Page = (props: PageProps) => {
  const [year, setYear] = useState(2023);

  const [displayMode, setDisplayMode] = useState<
    'Table' | 'Ranking' | 'Spectator'
  >('Table');

  const handleChange = (event: React.ChangeEvent<{}>, value: number) => {
    setYear(value);
    props.setSelectedGameList(DATA_SET[value]);
  };

  return (
    <div className='page'>
      <YearSelectionTabs handleChange={handleChange} year={year} />
      <Button
        label='表を表示'
        primary={displayMode === 'Table'}
        onClick={() => setDisplayMode('Table')}
      />
      <Button
        label='ランキングを表示'
        primary={displayMode === 'Ranking'}
        onClick={() => setDisplayMode('Ranking')}
      />
      <Button
        label='観客動員数情報を表示'
        primary={displayMode === 'Spectator'}
        onClick={() => setDisplayMode('Spectator')}
      />

      {displayMode === 'Table' && (
        <>
          <h1>{year}シーズン</h1>
          <GameInfoTable gameList={props.selectedGameList} />
        </>
      )}
      {displayMode === 'Ranking' && (
        <RankingPage year={year} selectedGameList={props.selectedGameList} />
      )}
      {displayMode === 'Spectator' && (
        <SpectatorPage year={year} selectedGameList={props.selectedGameList} />
      )}
    </div>
  );
};

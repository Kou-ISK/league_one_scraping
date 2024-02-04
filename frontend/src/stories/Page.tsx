import React, { Dispatch, useState } from 'react';

import './page.css';
import { GameInfoTable } from './gameInfoTable';
import { Game } from '../types/game';
import { YearSelectionTabs } from './yearSelectionTabs';
import { dataSet } from '../App';
import { RankingPage } from './rankingPage';
import { Button } from './Button';

interface PageProps {
  selectedGameList: Game[];
  setSelectedGameList: Dispatch<React.SetStateAction<Game[]>>;
}

export const Page = (props: PageProps) => {
  const [year, setYear] = useState(2023);

  const [displayMode, setDisplayMode] = useState<'Table' | 'Ranking'>('Table');

  const handleChange = (event: React.ChangeEvent<{}>, value: number) => {
    setYear(value);
    props.setSelectedGameList(dataSet[value]);
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

      {displayMode === 'Table' && (
        <>
          <h1>{year}シーズン</h1>
          <GameInfoTable gameList={props.selectedGameList} />
        </>
      )}
      {displayMode === 'Ranking' && (
        <RankingPage
          year={year}
          selectedGameList={props.selectedGameList}
          setSelectedGameList={props.setSelectedGameList}
        />
      )}
    </div>
  );
};

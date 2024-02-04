import React, { Dispatch, useState } from 'react';

import './page.css';
import { GameInfoTable } from '../stories/gameInfoTable';
import { Game } from '../types/game';
import { YearSelectionTabs } from '../stories/yearSelectionTabs';
import { dataSet } from '../App';

interface PageProps {
  selectedGameList: Game[];
  setSelectedGameList: Dispatch<React.SetStateAction<Game[]>>;
}

export const Page = (props: PageProps) => {
  const [year, setYear] = useState(2023);
  const handleChange = (event: React.ChangeEvent<{}>, value: number) => {
    setYear(value);
    props.setSelectedGameList(dataSet[value]);
  };

  return (
    <div className='page'>
      <YearSelectionTabs handleChange={handleChange} year={year} />
      <h1>{year}シーズン</h1>
      <GameInfoTable gameList={props.selectedGameList} />
    </div>
  );
};

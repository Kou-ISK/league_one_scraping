import React, { Dispatch, useState } from 'react';

import './page.css';
import { Button } from './Button';
import { GameInfoTable } from './gameInfoTable';
import { Game } from '../types/game';

interface PageProps {
  selectedGameList: Game[];
  setSelectedGameList: Dispatch<React.SetStateAction<Game[]>>;
  dataSet: { 2022: Game[]; 2023: Game[] };
}
export const Page = (props: PageProps) => {
  const [year, setYear] = useState(2022);
  const [isButton2022Selected, setIsButton2022Selected] = useState(true);
  const handleYear = (year: number) => {
    setYear(year);
    if (year === 2022) {
      props.setSelectedGameList(props.dataSet[2022]);
      setIsButton2022Selected(true);
    }
    if (year === 2023) {
      props.setSelectedGameList(props.dataSet[2023]);
      setIsButton2022Selected(false);
    }
  };
  return (
    <div>
      <Button
        primary={!isButton2022Selected}
        label={'2022'}
        onClick={() => handleYear(2022)}
      />
      <Button
        primary={isButton2022Selected}
        label={'2023'}
        onClick={() => handleYear(2023)}
      />
      <h1>{year}シーズン</h1>
      <GameInfoTable gameList={props.selectedGameList} />
    </div>
  );
};

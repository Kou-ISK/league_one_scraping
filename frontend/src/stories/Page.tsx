import React, { Dispatch, useState } from 'react';

import './page.css';
import { GameInfoTable } from './gameInfoTable';
import { Game } from '../types/game';
import { Paper, Tab, Tabs } from '@mui/material';

interface PageProps {
  selectedGameList: Game[];
  setSelectedGameList: Dispatch<React.SetStateAction<Game[]>>;
  dataSet: { [key: number]: Game[] };
}

export const Page = (props: PageProps) => {
  const [year, setYear] = useState(2023);
  const handleChange = (event: React.ChangeEvent<{}>, value: number) => {
    setYear(value);
    props.setSelectedGameList(props.dataSet[value]);
  };

  return (
    <div>
      <Paper>
        <Tabs
          value={year}
          onChange={handleChange}
          indicatorColor='primary'
          textColor='primary'
          centered
        >
          <Tab label='2022' value={2021} />
          <Tab label='2022-2023' value={2022} />
          <Tab label='2023-2024' value={2023} />
        </Tabs>
      </Paper>
      <h1>{year}シーズン</h1>
      <GameInfoTable gameList={props.selectedGameList} />
    </div>
  );
};

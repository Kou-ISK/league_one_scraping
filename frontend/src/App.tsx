import React, { useState } from 'react';
import './App.css';
import leagueData2022 from './datas/2022_league_one_game_data.json';
import leagueData2023 from './datas/2023_league_one_game_data.json';
import { GameInfoTable } from './stories/gameInfoTable';
import { Button } from './stories/Button';
import { Game } from './types/game';

function App() {
  const dataOf2022 = leagueData2022 as Game[];
  const dataOf2023 = leagueData2023 as Game[];
  const [data, setData] = useState(dataOf2022);
  const [year, setYear] = useState(2022);
  const [isButton2022Selected, setIsButton2022Selected] = useState(true);

  const handleYear = (year: number) => {
    setYear(year);
    if (year === 2022) {
      setData(dataOf2022);
      setIsButton2022Selected(true);
    }
    if (year === 2023) {
      setData(dataOf2023);
      setIsButton2022Selected(false);
    }
  };

  return (
    <div className='App'>
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
      <GameInfoTable gameList={data} />
    </div>
  );
}

export default App;

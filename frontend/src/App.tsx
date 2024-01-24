import React, { useState } from 'react';
import './App.css';
import leagueData2022 from './datas/2022_league_one_game_data.json';
import leagueData2023 from './datas/2023_league_one_game_data.json';
import { GameInfoTable } from './stories/gameInfoTable';
import { Button } from './stories/Button';
import { Game } from './types/game';

function App() {
  const [year, setYear] = useState(2023);
  const dataOf2022 = leagueData2022 as Game[];
  const dataOf2023 = leagueData2023 as Game[];
  return (
    <div className='App'>
      <Button primary={true} label={'2022'} onClick={() => setYear(2022)} />
      <Button primary={true} label={'2023'} onClick={() => setYear(2023)} />
      <h1>{year}シーズン</h1>
      <GameInfoTable gameList={eval(`dataOf${year}`)} />
    </div>
  );
}

export default App;

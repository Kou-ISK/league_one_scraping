import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import leagueData2022 from './datas/2022_league_one_game_data.json';
import leagueData2023 from './datas/2023_league_one_game_data.json';
import { Game } from './types/game';
import { Page } from './stories/Page';
import { GameDetailPage } from './stories/gameDetailPage';
import { Header } from './stories/Header';

export const dataOf2022 = leagueData2022 as Game[];
export const dataOf2023 = leagueData2023 as Game[];
export const allGame: Game[] = [...leagueData2022, ...leagueData2023];

function App() {
  const dataSet: { [key: number]: Game[] } = {
    '2022': dataOf2022,
    '2023': dataOf2023,
  };
  const [selectedGameList, setSelectedGameList] = useState<Game[]>(dataOf2022);

  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route
            path='/league_one_scraping'
            element={
              <Page
                selectedGameList={selectedGameList}
                setSelectedGameList={setSelectedGameList}
                dataSet={dataSet}
              />
            }
          />
          <Route
            path='/league_one_scraping/game/:id'
            Component={() => <GameDetailPage />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;

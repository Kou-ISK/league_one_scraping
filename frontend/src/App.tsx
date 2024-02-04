import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import leagueData2021 from './datas/2021_league_one_game_data.json';
import leagueData2022 from './datas/2022_league_one_game_data.json';
import leagueData2023 from './datas/2023_league_one_game_data.json';
import { Game } from './types/game';
import { Page } from './stories/Page';
import { GameDetailPage } from './stories/gameDetailPage';
import { Header } from './stories/Header';
import { RankingPage } from './stories/rankingPage';

export const dataOf2021 = leagueData2021 as Game[];
export const dataOf2022 = leagueData2022 as Game[];
export const dataOf2023 = leagueData2023 as Game[];
export const allGame: Game[] = [
  ...leagueData2021,
  ...leagueData2022,
  ...leagueData2023,
];
export const dataSet: { [key: number]: Game[] } = {
  '2021': dataOf2021,
  '2022': dataOf2022,
  '2023': dataOf2023,
};

function App() {
  const [selectedGameList, setSelectedGameList] = useState<Game[]>(dataOf2023);
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

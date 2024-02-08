import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Game } from './types/game';
import { Page } from './stories/Page';
import { GameDetailPage } from './stories/gameDetailPage';
import { Header } from './stories/Header';
import { DATA_OF_2023 } from './variables';

function App() {
  const [selectedGameList, setSelectedGameList] =
    useState<Game[]>(DATA_OF_2023);
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

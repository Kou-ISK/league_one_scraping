import React, { useState } from 'react';
import './App.css';
import leagueData2022 from './datas/2022_league_one_game_data.json';
import leagueData2023 from './datas/2023_league_one_game_data.json';
import { GameInfoTable } from './stories/gameInfoTable';
import { Button } from './stories/Button';
import { Game } from './types/game';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { PlayerObjectList } from './stories/playerObjectList';

function App() {
  const dataOf2022 = leagueData2022 as Game[];
  const dataOf2023 = leagueData2023 as Game[];
  const [data, setData] = useState(dataOf2022);
  const [year, setYear] = useState(2022);

  const handleYear = (year: number) => {
    setYear(year);
    if (year === 2022) {
      setData(dataOf2022);
    }
    if (year === 2023) {
      setData(dataOf2023);
    }
  };
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'basic_info', headerName: 'basic_info', width: 200 },
    { field: 'home_team', headerName: 'home_team', width: 200 },
    { field: 'home_team_score', headerName: 'home_team_score', width: 70 },
    { field: 'away_team_score', headerName: 'away_team_score', width: 70 },
    { field: 'away_team', headerName: 'away_team', width: 200 },
    { field: 'date', headerName: 'date', width: 100 },
    { field: 'weather', headerName: 'weather', width: 70 },
    { field: 'spectator', headerName: 'spectator', width: 70 },
    {
      field: 'home_team_player_list',
      headerName: 'home_team_player_list',
      width: 120,
      valueGetter: (params: GridValueGetterParams) => {
        return <PlayerObjectList playerList={params} />;
      },
    },
    {
      field: 'away_team_player_list',
      headerName: 'away_team_player_list',
      width: 120,
      valueGetter: (params: GridValueGetterParams) => {
        return <PlayerObjectList playerList={params} />;
      },
    },
  ];

  return (
    <div className='App'>
      <Button primary={true} label={'2022'} onClick={() => handleYear(2022)} />
      <Button primary={true} label={'2023'} onClick={() => handleYear(2023)} />
      <h1>{year}シーズン</h1>
      <DataGrid rows={data} columns={columns} checkboxSelection />
    </div>
  );
}

export default App;

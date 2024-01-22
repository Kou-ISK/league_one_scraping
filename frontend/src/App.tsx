import React from 'react';
import './App.css';
import leagueData2022 from './datas/2022_league_one_game_data.json';
import leagueData2023 from './datas/2023_league_one_game_data.json';
import { PlayerObjectList } from './stories/playerObjectList';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

function App() {
  return (
    <div className='App'>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Game ID</TableCell>
              <TableCell>基本情報</TableCell>
              <TableCell>ホストチーム</TableCell>
              <TableCell>ホストチーム得点</TableCell>
              <TableCell>ビジターチーム得点</TableCell>
              <TableCell>ビジターチーム</TableCell>
              <TableCell>試合日</TableCell>
              <TableCell>天候</TableCell>
              <TableCell>観客動員数</TableCell>
              <TableCell>ホストチーム選手リスト</TableCell>
              <TableCell>ビジターチーム選手リスト</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leagueData2022.map((data) => (
              <TableRow>
                <TableCell>{data.id}</TableCell>
                <TableCell>{data.basic_info}</TableCell>
                <TableCell>{data.home_team}</TableCell>
                <TableCell>{data.home_team_score}</TableCell>
                <TableCell>{data.away_team_score}</TableCell>
                <TableCell>{data.away_team}</TableCell>
                <TableCell>{data.date}</TableCell>
                <TableCell>{data.weather}</TableCell>
                <TableCell>{data.spectator}</TableCell>
                <TableCell>
                  <PlayerObjectList playerList={data.home_team_player_list} />
                </TableCell>
                <TableCell>
                  <PlayerObjectList playerList={data.away_team_player_list} />
                </TableCell>
              </TableRow>
            ))}
            {leagueData2023.map((data) => (
              <TableRow>
                <TableCell>{data.id}</TableCell>
                <TableCell>{data.basic_info}</TableCell>
                <TableCell>{data.home_team}</TableCell>
                <TableCell>{data.home_team_score}</TableCell>
                <TableCell>{data.away_team_score}</TableCell>
                <TableCell>{data.away_team}</TableCell>
                <TableCell>{data.date}</TableCell>
                <TableCell>{data.weather}</TableCell>
                <TableCell>{data.spectator}</TableCell>
                <TableCell>
                  <PlayerObjectList playerList={data.home_team_player_list} />
                </TableCell>
                <TableCell>
                  <PlayerObjectList playerList={data.away_team_player_list} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;

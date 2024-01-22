import React from 'react';
import './App.css';
import leagueData2022 from './datas/2022_league_one_game_data.json';
import leagueData2023 from './datas/2023_league_one_game_data.json';
import { PlayerObjectList } from './stories/playerObjectList';

function App() {
  return (
    <div className='App'>
      <table>
        <tr>
          <th>Game ID</th>
          <th>基本情報</th>
          <th>ホストチーム</th>
          <th>ホストチーム得点</th>
          <th>ビジターチーム得点</th>
          <th>ビジターチーム</th>
          <th>試合日</th>
          <th>天候</th>
          <th>観客動員数</th>
          <th>ホストチーム選手リスト</th>
          <th>ビジターチーム選手リスト</th>
        </tr>
        {leagueData2022.map((data) => (
          <tr>
            <td>{data.id}</td>
            <td>{data.basic_info}</td>
            <td>{data.home_team}</td>
            <td>{data.home_team_score}</td>
            <td>{data.away_team_score}</td>
            <td>{data.away_team}</td>
            <td>{data.date}</td>
            <td>{data.weather}</td>
            <td>{data.spectator}</td>
            <td>
              <PlayerObjectList playerList={data.home_team_player_list} />
            </td>
            <td>
              <PlayerObjectList playerList={data.away_team_player_list} />
            </td>
          </tr>
        ))}
        {leagueData2023.map((data) => (
          <tr>
            <td>{data.id}</td>
            <td>{data.basic_info}</td>
            <td>{data.home_team}</td>
            <td>{data.home_team_score}</td>
            <td>{data.away_team_score}</td>
            <td>{data.away_team}</td>
            <td>{data.date}</td>
            <td>{data.weather}</td>
            <td>{data.spectator}</td>
            <td>
              <PlayerObjectList playerList={data.home_team_player_list} />
            </td>
            <td>
              <PlayerObjectList playerList={data.away_team_player_list} />
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default App;

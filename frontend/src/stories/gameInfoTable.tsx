import { Game } from '../types/game';
import { PlayerObjectList } from './playerObjectList';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

interface GameInfoTableProps {
  gameList: Game[];
}
export const GameInfoTable = (props: GameInfoTableProps) => {
  const gameList = props.gameList;
  return (
    <TableContainer sx={{ marginX: '1vw', justifySelf: 'center' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '10px' }}>Game ID</TableCell>
            <TableCell>基本情報</TableCell>
            <TableCell>ホストチーム</TableCell>
            <TableCell sx={{ width: '10px' }}>ホストチーム得点</TableCell>
            <TableCell sx={{ width: '10px' }}>ビジターチーム得点</TableCell>
            <TableCell>ビジターチーム</TableCell>
            <TableCell sx={{ width: '10px' }}>試合日</TableCell>
            <TableCell sx={{ width: '10px' }}>天候</TableCell>
            <TableCell sx={{ width: '10px' }}>観客動員数</TableCell>
            <TableCell>ホストチーム選手リスト</TableCell>
            <TableCell>ビジターチーム選手リスト</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {gameList.map((data) => (
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
  );
};

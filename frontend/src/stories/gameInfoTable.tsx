import { Game } from '../types/game';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface GameInfoTableProps {
  gameList: Game[];
}
export const GameInfoTable = (props: GameInfoTableProps) => {
  const gameList = props.gameList;
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'basic_info', headerName: '基本情報', width: 600 },
    { field: 'home_team', headerName: 'ホストチーム', width: 300 },
    { field: 'home_team_score', headerName: 'ホストチーム得点', width: 150 },
    { field: 'away_team_score', headerName: 'ビジターチーム得点', width: 150 },
    { field: 'away_team', headerName: 'ビジターチーム', width: 300 },
    { field: 'date', headerName: '日時', width: 200 },
    { field: 'weather', headerName: '天候', width: 200 },
    { field: 'spectator', headerName: '観客動員数', width: 200 },
    { field: 'referee_name', headerName: 'レフェリー', width: 200 },
    { field: 'stadium', headerName: 'スタジアム', width: 300 },
  ];
  return <DataGrid rows={gameList} columns={columns} checkboxSelection />;
};

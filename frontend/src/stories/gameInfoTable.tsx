import { Link } from 'react-router-dom';
import { Game } from '../types/game';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from '@mui/x-data-grid';
import './gameInfoTable.css';

interface GameInfoTableProps {
  gameList: Game[];
}
export const GameInfoTable = (props: GameInfoTableProps) => {
  const gameList = props.gameList;
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 50,
      renderCell: (params: GridRenderCellParams<any>) => (
        <Link
          className='text-blue-400 underline'
          to={`/league_one_scraping/game/${params.id}`}
        >
          {params.value}
        </Link>
      ),
    },
    { field: 'division', headerName: 'Div.', width: 50 },
    { field: 'basic_info', headerName: '基本情報', width: 350 },
    { field: 'home_team', headerName: 'ホストチーム', width: 300 },
    { field: 'home_team_score', headerName: 'ホストチーム得点', width: 150 },
    { field: 'away_team_score', headerName: 'ビジターチーム得点', width: 150 },
    { field: 'away_team', headerName: 'ビジターチーム', width: 300 },
    { field: 'date', headerName: '日時', width: 130 },
    { field: 'weather', headerName: '天候', width: 200 },
    { field: 'spectator', headerName: '観客動員数', width: 130 },
    { field: 'referee_name', headerName: 'レフェリー', width: 200 },
    { field: 'stadium', headerName: 'スタジアム', width: 300 },
  ];

  return (
    <>
      <DataGrid
        className='game-info-table'
        rows={gameList}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
      />
    </>
  );
};

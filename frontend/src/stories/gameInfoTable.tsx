import { Game } from '../types/game';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { GameInfoModal } from './gameInfoModal';
import { useState } from 'react';

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
    { field: 'date', headerName: '日時', width: 130 },
    { field: 'weather', headerName: '天候', width: 200 },
    { field: 'spectator', headerName: '観客動員数', width: 130 },
    { field: 'referee_name', headerName: 'レフェリー', width: 200 },
    { field: 'stadium', headerName: 'スタジアム', width: 300 },
  ];

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [open, setOpen] = useState(true);
  const showModalonClick = (id: number) => {
    setOpen(true);
    const selectedGame = gameList.find((game: Game) => game.id === id) as Game;
    setSelectedGame(selectedGame);
  };

  return (
    <>
      <DataGrid
        rows={gameList}
        columns={columns}
        onRowClick={(params: GridRowParams) => showModalonClick(params.row.id)}
      />
      {open && selectedGame && (
        <GameInfoModal open={open} setOpen={setOpen} game={selectedGame} />
      )}
    </>
  );
};

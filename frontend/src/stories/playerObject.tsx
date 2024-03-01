import React from 'react';
import { Player } from '../types/player';
import Typography from '@mui/material/Typography';
import { TEAM_MASTER_DATA, LEAGUE_ONE_ROOT_URL } from '../variables';
import { Paper } from '@mui/material';

interface PlayerObjectProps {
  player: Player;
}
export const PlayerObject = (props: PlayerObjectProps) => {
  const player = props.player;
  return (
    <Paper sx={{ margin: '5px' }}>
      <Typography sx={{ padding: '10px' }}>
        {player.number}.{' '}
        <a
          href={
            LEAGUE_ONE_ROOT_URL +
            'player/' +
            TEAM_MASTER_DATA.flatMap((team) => team.player_list).find(
              (player) => player.name
            )?.player_id
          }
        >
          {player.name}
        </a>
      </Typography>
    </Paper>
  );
};

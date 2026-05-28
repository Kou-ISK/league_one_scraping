import React from 'react';
import { Player } from '../types/player';
import { TEAM_MASTER_DATA, LEAGUE_ONE_ROOT_URL } from '../variables';

interface PlayerObjectProps {
  player: Player;
}
export const PlayerObject = (props: PlayerObjectProps) => {
  const player = props.player;
  return (
    <div className='player-card'>
      <span className='player-number'>{player.number}</span>
      <span className='player-name'>
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
      </span>
    </div>
  );
};

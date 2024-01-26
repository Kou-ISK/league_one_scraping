import React from 'react';
import { Player } from '../types/player';
import { PlayerObject } from './playerObject';
interface PlayerObjectListProps {
  playerList: any;
}
export const PlayerObjectList = (props: PlayerObjectListProps) => {
  const playerList = props.playerList;
  return (
    <>
      {playerList.map((player: Player) => (
        <PlayerObject player={player} />
      ))}
    </>
  );
};

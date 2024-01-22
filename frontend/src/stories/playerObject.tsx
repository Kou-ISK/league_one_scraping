import React from 'react';
import { Player } from '../types/player';

interface PlayerObjectProps {
  player: Player;
}
export const PlayerObject = (props: PlayerObjectProps) => {
  const player = props.player;
  return (
    <>
      <h1>{player.name}</h1>
      <p>{player.position}</p>
      <p>{player.number}</p>
      <p>{player.height}</p>
      <p>{player.weight}</p>
      <p>{player.age}</p>
    </>
  );
};

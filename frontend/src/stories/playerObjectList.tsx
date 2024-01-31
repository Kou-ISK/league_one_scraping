import React from 'react';
import { Player } from '../types/player';
import { Replacement } from '../types/replacement';

import { PlayerReplacementObject } from './playerReplacementObject';

interface PlayerObjectListProps {
  playerList: Player[];
  replacementList: Replacement[];
}

export const PlayerObjectList = (props: PlayerObjectListProps) => {
  const playerList = props.playerList;

  // getReplacementInfo 関数をここで定義
  const getReplacementInfo = (playerNumber: number) => {
    const replacementItem = props.replacementList.find(
      (value) => value.from_player_number === playerNumber
    ) as Replacement | undefined;
    const toPlayerNumber = replacementItem?.to_player_number;
    const replacedToPlayer = playerList.find(
      (player) => player.number === toPlayerNumber
    ) as Player;
    const iconColor = replacementItem?.back_time ? 'error' : 'primary';
    return { replacedToPlayer, replacementItem, iconColor };
  };

  const getParticipatedPlayerList = () => {
    return props.playerList.filter(
      (value) =>
        value.number <= 15 ||
        value.number in
          props.replacementList.map((value) => value.from_player_number)
    );
  };

  const getNotParticipatedOrReReplacedPlayerList = () => {
    const replacedToPlayerNumber = props.replacementList.map(
      (value) => value.to_player_number
    );
    const replacedFromPlayerNumber = props.replacementList.map(
      (value) => value.from_player_number
    );

    return props.playerList.filter(
      (player) =>
        (player.number > 15 &&
          !replacedToPlayerNumber.includes(player.number)) ||
        (player.number > 15 && replacedFromPlayerNumber.includes(player.number))
    );
  };

  return (
    <>
      {getParticipatedPlayerList().map((value) => {
        return (
          <PlayerReplacementObject
            player={value}
            replacementInfo={getReplacementInfo(value.number)}
          />
        );
      })}
      {getNotParticipatedOrReReplacedPlayerList().length > 0 && (
        <p>未出場/再入替</p>
      )}
      {getNotParticipatedOrReReplacedPlayerList().map((value) => {
        return (
          <PlayerReplacementObject
            player={value}
            replacementInfo={getReplacementInfo(value.number)}
          />
        );
      })}
    </>
  );
};

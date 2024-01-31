import React from 'react';
import { Player } from '../types/player';
import { PlayerObject } from './playerObject';
import { Replacement } from '../types/replacement';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

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
    );
    const toPlayerNumber = replacementItem?.to_player_number;
    const replacementTimeInfo = ((replacementItem?.half_type as string) +
      replacementItem?.time +
      '分') as string;
    const replacedToPlayer = playerList.find(
      (player) => player.number === toPlayerNumber
    ) as Player;
    const iconColor = playerNumber <= 15 ? 'primary' : 'error';
    return { replacedToPlayer, replacementTimeInfo, iconColor };
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

  const createPlayerListObject = (player: Player) => {
    const replacementInfo = getReplacementInfo(player.number);
    return (
      <>
        <div
          style={{ display: 'flex', justifyContent: 'space-between' }}
          key={player?.number}
        >
          <PlayerObject player={player} />
          {replacementInfo.replacedToPlayer && (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <ChangeCircleIcon
                  color={replacementInfo.iconColor as 'error' | 'primary'}
                  sx={{ paddingTop: '15px' }}
                />
                <p>{replacementInfo.replacementTimeInfo}</p>
              </div>
              <PlayerObject player={replacementInfo.replacedToPlayer} />
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      {getParticipatedPlayerList().map(createPlayerListObject)}
      {getNotParticipatedOrReReplacedPlayerList().length > 0 && (
        <p>未出場/再入替</p>
      )}
      {getNotParticipatedOrReReplacedPlayerList().map(createPlayerListObject)}
    </>
  );
};

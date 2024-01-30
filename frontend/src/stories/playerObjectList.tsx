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
    const toPlayerNumber = props.replacementList.find(
      (value) => value.from_player_number === playerNumber
    )?.to_player_number;
    const replacedToPlayer = playerList.find(
      (player) => player.number === toPlayerNumber
    ) as Player;
    const iconColor = playerNumber <= 15 ? 'primary' : 'error';
    return { replacedToPlayer, iconColor };
  };

  const participatedPlayerList = () => {
    return props.playerList.filter(
      (value) =>
        value.number <= 15 ||
        value.number in
          props.replacementList.map((value) => value.from_player_number)
    );
  };

  // TODO　フィルター条件を修正
  const notParticipatedPlayerList = () => {
    console.log(
      props.playerList.filter(
        (player) =>
          player.number > 15 &&
          player.number in
            props.replacementList.map((value) => value.to_player_number) ===
            false
      )
    );
    return props.playerList.filter(
      (player) =>
        player.number > 15 &&
        player.number in
          props.replacementList.map((value) => value.from_player_number) ===
          false
    );
  };

  const participatedPlayerObject = participatedPlayerList().map(
    (player: Player) => {
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
                <ChangeCircleIcon
                  color={replacementInfo.iconColor as 'error' | 'primary'}
                  sx={{ paddingTop: '10px' }}
                />
                <PlayerObject player={replacementInfo.replacedToPlayer} />
              </>
            )}
          </div>
        </>
      );
    }
  );

  const notParticipatedPlayerObject = notParticipatedPlayerList().map(
    (player: Player) => {
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
                <ChangeCircleIcon
                  color={replacementInfo.iconColor as 'error' | 'primary'}
                  sx={{ paddingTop: '10px' }}
                />
                <PlayerObject player={replacementInfo.replacedToPlayer} />
              </>
            )}
          </div>
        </>
      );
    }
  );
  return (
    <>
      {participatedPlayerObject}
      <p>---</p>
      {notParticipatedPlayerObject}
    </>
  );
};

import { Player } from '../types/player';
import { Replacement } from '../types/replacement';
import { PlayerObject } from './playerObject';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import './playerReplacementObject.css';

interface PlayerReplacementObjectProps {
  player: Player;
  replacementInfo: {
    replacedToPlayer: Player;
    replacementItem: Replacement | undefined;
    iconColor: string;
  };
}

export const PlayerReplacementObject = (
  props: PlayerReplacementObjectProps
) => {
  const replacementTime = ((props.replacementInfo.replacementItem
    ?.half_type as string) +
    props.replacementInfo.replacementItem?.time) as string;
  console.log(props.replacementInfo.replacementItem);

  const replacementType = props.replacementInfo.replacementItem?.type.includes(
    'シンビン'
  )
    ? '他選手シンビンの影響'
    : props.replacementInfo.replacementItem?.type;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <PlayerObject player={props.player} />
        {props.replacementInfo.replacedToPlayer && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <ChangeCircleIcon
                color={props.replacementInfo.iconColor as 'error' | 'primary'}
                sx={{ paddingTop: '7px' }}
              />
              <div>
                <p>
                  {replacementTime}分 ({replacementType})
                </p>
                {props.replacementInfo.replacementItem?.back_time && (
                  <p>
                    {props.replacementInfo.replacementItem?.half_type +
                      props.replacementInfo.replacementItem?.back_time}
                    分に戻る
                  </p>
                )}
              </div>
            </div>
            <PlayerObject player={props.replacementInfo.replacedToPlayer} />
          </>
        )}
      </div>
    </>
  );
};

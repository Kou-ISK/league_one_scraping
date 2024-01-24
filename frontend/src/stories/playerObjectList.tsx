import React from 'react';
import { Player } from '../types/player';
import { PlayerObject } from './playerObject';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface PlayerObjectListProps {
  playerList: any;
}
export const PlayerObjectList = (props: PlayerObjectListProps) => {
  const playerList = props.playerList;
  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          選手リスト
        </AccordionSummary>
        {playerList.map((player: Player) => (
          <AccordionDetails>
            <PlayerObject player={player} />
          </AccordionDetails>
        ))}
      </Accordion>
    </>
  );
};

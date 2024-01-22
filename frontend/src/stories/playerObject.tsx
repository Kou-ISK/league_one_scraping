import React from 'react';
import { Player } from '../types/player';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface PlayerObjectProps {
  player: Player;
}
export const PlayerObject = (props: PlayerObjectProps) => {
  const player = props.player;
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
        <Typography>{player.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{player.position}</Typography>
        <Typography>{player.number}</Typography>
        <Typography>{player.height}</Typography>
        <Typography>{player.weight}</Typography>
        <Typography>{player.age}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

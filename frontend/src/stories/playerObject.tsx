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
    <Accordion sx={{ marginTop: '3px', backgroundColor: 'whitesmoke' }}>
      <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
        <Typography sx={{ fontSize: '15px' }}>
          {player.number}. {player.name}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Position: {player.position}</Typography>
        <Typography>Height: {player.height}</Typography>
        <Typography>Weight: {player.weight}</Typography>
        <Typography>Age: {player.age}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

import React from 'react';
import { Player } from '../types/player';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { TEAM_MASTER_DATA, LEAGUE_ONE_ROOT_URL } from '../variables';

interface PlayerObjectProps {
  player: Player;
}
export const PlayerObject = (props: PlayerObjectProps) => {
  const player = props.player;
  return (
    <Accordion sx={{ marginTop: '3px' }}>
      <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
        <Typography sx={{ fontSize: '15px' }}>
          {player.number}.{' '}
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

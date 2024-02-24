import { PlayerMaster } from './playerMaster';

export type TeamMaster = {
  team_name: string;
  color: string;
  logo_url: string;
  player_list: PlayerMaster[];
};

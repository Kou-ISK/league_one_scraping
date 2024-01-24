import { Player } from './player';
import { Replacement } from './replacement';
import { ScoreInfo } from './scoreInfo';

export type Game = {
  id: number;
  basic_info: string;
  date: string;
  host_team: string;
  stadium: string;
  spectator: number;
  weather: string;
  home_team: string;
  away_team: string;
  home_team_score: number;
  home_team_player_list: Player[];
  home_team_replacement_list: Replacement[];
  home_team_temporary_replacement_list: Replacement[];
  away_team_score: number;
  away_team_player_list: Player[];
  away_team_replacement_list: Replacement[];
  away_team_temporary_replacement_list: Replacement[];
  referee_name: string;
  score_progress: ScoreInfo[];
};

import leagueData2021 from './datas/2021_league_one_game_data.json';
import leagueData2022 from './datas/2022_league_one_game_data.json';
import leagueData2023 from './datas/2023_league_one_game_data.json';
import { Game } from './types/game';

export const DIVISION_LIST = [1, 2, 3];

export const DATA_OF_2021 = leagueData2021 as Game[];
export const DATA_OF_2022 = leagueData2022 as Game[];
export const DATA_OF_2023 = leagueData2023 as Game[];
export const ALL_GAME: Game[] = [
  ...DATA_OF_2021,
  ...DATA_OF_2022,
  ...DATA_OF_2023,
];
export const DATA_SET: { [key: number]: Game[] } = {
  '2021': DATA_OF_2021,
  '2022': DATA_OF_2022,
  '2023': DATA_OF_2023,
};

export type Replacement = {
  type: string;
  time: number;
  half_type: string;
  from_player_number: number;
  to_player_number: number | null;
  back_time: number | null;
};

from dataclasses import dataclass


@dataclass()
class Score:
    time: int
    team_name: str
    player_number: int
    player_name: str
    score_type: str
    host_team_score: int
    away_team_score: int

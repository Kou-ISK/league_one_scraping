from dataclasses import dataclass
from league_one_scraping.domain.data.replacement import Replacement
from league_one_scraping.domain.data.score import Score
from .player import Player


@dataclass()
class Game:
    id: str
    basic_info: str
    date: str
    host_team: str
    stadium: str
    spectator: int
    weather: str
    home_team: str
    away_team: str
    home_team_score: int
    home_team_player_list: [Player]
    home_team_replacement_list: [Replacement]
    away_team_score: int
    away_team_player_list: [Player]
    away_team_replacement_list: [Replacement]
    referee_name: str
    score_progress: [Score]

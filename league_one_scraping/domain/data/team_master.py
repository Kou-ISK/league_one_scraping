from dataclasses import asdict, dataclass

from league_one_scraping.domain.data.player_master import Player_Master


@dataclass()
class Team_Master:
    team_name: str
    color: str
    logo_url: str
    player_list: [Player_Master]

    def to_dict(self):
        # asdictを使用してdataclassを辞書に変換
        return asdict(self)

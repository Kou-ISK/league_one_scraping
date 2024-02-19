from dataclasses import asdict, dataclass


@dataclass()
class Team_Master:
    team_name: str
    color: str
    logo_url: str

    def to_dict(self):
        # asdictを使用してdataclassを辞書に変換
        return asdict(self)

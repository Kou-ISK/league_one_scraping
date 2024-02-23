from dataclasses import dataclass


@dataclass()
class Player_Master:
    team_name: str
    name: str
    photo: str
    position: str
    height: int
    weight: int
    birth_of_date: str
    category: str

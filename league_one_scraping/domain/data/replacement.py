from dataclasses import dataclass


@dataclass
class Replacement:
    type: str
    time: str
    from_player_number: int
    to_player_number: int

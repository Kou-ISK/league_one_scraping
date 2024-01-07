from dataclasses import dataclass


@dataclass
class Replacement:
    type: str
    time: int
    half_type: str
    from_player_number: int
    to_player_number: int
    back_time: int = None

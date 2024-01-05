from dataclasses import dataclass


@dataclass()
class Player:
    number: int
    name: str
    position: str
    height: int
    weight: int
    age: int

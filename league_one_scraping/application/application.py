import datetime
from ..domain import domain
import json


class Application:
    @classmethod
    def get_game_info_from_year(cls):
        year = cls.input_year()
        game_datas = domain.Domain.get_game_info_from_year(year=year)
        with open(f'{year}_league_one_game_data.json', 'w') as f:
            json.dump(game_datas, f, ensure_ascii=False,
                      indent=2, default=lambda x: x.to_dict())
        print('Job Completed')

    def input_year():
        while True:
            year = input("Which year?: ")
            if (int(year) > datetime.datetime.now().year) or (int(year) < 2021):
                print("Out of range")
            else:
                break
        return year

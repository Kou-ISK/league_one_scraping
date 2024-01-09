from ..domain import domain
import json


class Application:
    def get_game_info_from_year(year):
        game_datas = domain.Domain.get_game_info_from_year(year=year)
        with open(f'{year}_league_one_game_data.json', 'w') as f:
            json.dump(game_datas, f, ensure_ascii=False,
                      indent=2, default=lambda x: x.to_dict())

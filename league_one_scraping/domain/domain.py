from ..infrastructure import infrastructure
from time import sleep
import json


class Domain:
    def get_game_info_from_year(year):
        game_datas = []
        game_id_list = infrastructure.Infrastructure.get_game_id_list_from_year(
            year=year)
        for game_id in game_id_list:
            game = infrastructure.Infrastructure.get_individual_match_data(
                game_id=game_id)
            game_datas.append(game)
            sleep(1)
        with open('game_data.json', 'w') as f:
            json.dump(game_datas, f, ensure_ascii=False, indent=2)

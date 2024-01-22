import datetime
from ..domain import scraping_service
import json
from pathlib import Path


class Application:
    @classmethod
    def get_game_info_from_year(cls):
        year = cls.input_year()
        game_datas = scraping_service.ScrapingService.get_game_info_from_year(
            year=year)
        file_path = Path(
            f'./frontend/src/datas/{year}_league_one_game_data.json')
        with open(file_path.resolve(), 'w') as f:
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

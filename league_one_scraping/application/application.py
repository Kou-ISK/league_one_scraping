import datetime
from ..domain import scraping_service
import json
from pathlib import Path


class Application:
    @classmethod
    def get_game_info_from_year(cls, year):
        game_datas = scraping_service.ScrapingService.get_game_info_from_year(
            year=year)
        file_path = Path(
            f'./frontend/src/datas/{year}_league_one_game_data.json')
        with open(file_path.resolve(), 'w') as f:
            json.dump(game_datas, f, ensure_ascii=False,
                      indent=2, default=lambda x: x.to_dict())
        print('Job Completed')

    @classmethod
    def update_master_data(cls):
        team_datas = scraping_service.ScrapingService.update_master_data()
        file_path = Path(
            f'./frontend/src/datas/league_one_team_master_data.json')
        with open(file_path.resolve(), 'w') as f:
            json.dump(team_datas, f, ensure_ascii=False,
                      indent=2, default=lambda x: x.to_dict())
        print('Job Completed')

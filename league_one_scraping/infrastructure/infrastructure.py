import requests
from bs4 import BeautifulSoup
from time import sleep


class Infrastructure:

    def get_individual_match_data_soup(game_id):
        url = f"https://league-one.jp/match/{game_id}/print"
        response = requests.get(url)
        sleep(1)

        if response.status_code == 200:
            return BeautifulSoup(response.content, "html.parser")
        else:
            print(f"Failed to fetch data for game {game_id}")
            return None

    def get_game_id_list_from_year_and_tab(year):
        url = f"https://league-one.jp/schedule/?year={year}"
        response = requests.get(url)
        sleep(1)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            game_id_list = []
            match_detail_a_tag_list = soup.find_all(
                'a', attrs={'class': 'btn-match-detail'})
            for match_detail_a_tag in match_detail_a_tag_list:
                match_detail_href = match_detail_a_tag.get('href')
                game_id = match_detail_href.replace('/match/', '')
                print(game_id)
                game_id_list.append(game_id)
            return game_id_list
        else:
            print(f"Could not retrieve data from {year} season")

    def get_team_data_by_id(team_id):
        url = f"https://league-one.jp/team/{team_id}?t=1"
        response = requests.get(url)
        sleep(1)

        if response.status_code == 200:
            return BeautifulSoup(response.content, "html.parser")
        else:
            print(f"Failed to fetch data for the team_id: {team_id}")
            return None

    def get_team_id_list():
        url = f"https://league-one.jp/team/"
        response = requests.get(url)
        sleep(1)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            team_id_list = []
            all_division = soup.find_all('section')
            for division in all_division:
                team_a_tag_list = division.find_all(
                    'a')
                for team_a_tag in team_a_tag_list:
                    team_href = team_a_tag.get('href')
                    team_id = team_href.replace('/team/', '')
                    team_id_list.append(team_id)
            return team_id_list
        else:
            print(f"Could not retrieve team data")

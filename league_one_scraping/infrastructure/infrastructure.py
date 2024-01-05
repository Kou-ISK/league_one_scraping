import requests
from bs4 import BeautifulSoup


class Infrastructure:

    def get_individual_match_data_soup(game_id):
        url = f"https://league-one.jp/match/{game_id}/print"
        response = requests.get(url)

        if response.status_code == 200:
            return BeautifulSoup(response.content, "html.parser")
        else:
            print(f"Failed to fetch data for game {game_id}")
            return None

    def get_game_id_list_from_year(year):
        url = f"https://league-one.jp/schedule/?year={year}"
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            game_id_list = []
            match_detail_a_tag_list = soup.find_all(
                'a', attrs={'class': 'btn-match-detail'})
            for match_detail_a_tag in match_detail_a_tag_list:
                match_detail_href = match_detail_a_tag.get('href')
                game_id = match_detail_href.replace('/match/', '')
                game_id_list.append(game_id)
            return game_id_list
        else:
            print(f"Could not retrieve data from {year} season")

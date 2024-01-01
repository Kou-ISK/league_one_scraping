from dataclasses import dataclass
import requests
from bs4 import BeautifulSoup
import re


@dataclass()
class Game:
    id: str
    basic_info: str
    date: str
    host_team: str
    stadium: str
    spectator: int
    weather: str
    team_1: str
    team_2: str
    team_1_score: int
    team_2_score: int
    referee_name: str


@dataclass
class Player:
    number: int
    name: str
    position: str
    height: int
    weight: int
    age: int


# ================= Variables ========================
info_selector = "#container > header > div.title > h2"
host_team_selector = "#info > table.info1 > tr:nth-child(5) > td"
stadium_selector = "#info > table.info1 > tr:nth-child(2) > td:nth-child(2)"
spectator_selector = "#info > table.info1 > tr:nth-child(2) > td:nth-child(4)"
weather_selector = "#info > table.info1 > tr:nth-child(3) > td:nth-child(2)"
game_date_selector = "#info > table.info1 > tr:nth-child(1) > td:nth-child(2)"
ref_selector = "#info > table.info2 > tr:nth-child(1) > td:nth-child(2)"

team_1_selector = "#team > div.team.home > table > tr > th.title"
team_2_selector = "#team > div.team.away > table > tr > th.title"

team_1_score_selector = "#team > div.result > table.score > tr:nth-child(10) > td:nth-child(1)"
team_2_score_selector = "#team > div.result > table.score > tr:nth-child(10) > td:nth-child(3)"
# ====================================================


class Infrastructure:
    def get_individual_match_data(game_id):
        url = f"https://league-one.jp/match/{game_id}/print"
        response = requests.get(url)

        if response.status_code == 200:
            soup = BeautifulSoup(response.content, "html.parser")
            get_player_list_from_bs(soup)
            # CSSセレクタを使って要素を取得
            info = re.sub(r'\s+', ' ', soup.select_one(
                info_selector).text).strip()
            game_date = soup.select_one(
                game_date_selector).text.strip().split()[0]
            host_team = soup.select_one(host_team_selector).text.strip()
            stadium = soup.select_one(stadium_selector).text.strip()
            spectator = int(soup.select_one(
                spectator_selector).text.strip().replace(",", "").replace("人", ""))
            weather = soup.select_one(weather_selector).text.strip()
            team_1 = soup.select_one(team_1_selector).text.strip()
            team_2 = soup.select_one(team_2_selector).text.strip()
            team_1_score = int(soup.select_one(
                team_1_score_selector).text.strip())
            team_2_score = int(soup.select_one(
                team_2_score_selector).text.strip())
            ref = soup.select_one(ref_selector).text.strip()
            game = Game(id=game_id, basic_info=info, date=game_date, host_team=host_team, stadium=stadium, spectator=spectator,
                        weather=weather, team_1=team_1, team_2=team_2, team_1_score=team_1_score, team_2_score=team_2_score, referee_name=ref)
            print(game)
            return game

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
            print("Could not retrieve data from {year} season")


def get_player_list_from_bs(soup):
    playerList = []
    # 子要素に
    team_1_players_selector = '#team > div.team.home > table > tr'
    team_2_players_selector = '#team > div.team.away > table > tr:nth-child(3)'
    rows = soup.select(team_1_players_selector)
    for row in rows:
        print(rows)
        print('============================')
        print(row)
        cells = row.find_all('td')
        if cells:
            number = cells[0].text.strip()
            raw_player_basic_info = cells[1].text.strip()
            # TODO ポジションが取得できない場合がある
            position = cells[2].text.strip() or None

            # 正規表現を使用して文字列を抽出
            match = re.match(r"(\S+)\（(\d+)\/(\d+)\/(\d+)）",
                             raw_player_basic_info)
            if match:
                name = match.group(1)
                height = int(match.group(2))
                weight = int(match.group(3))
                age = int(match.group(4))
            else:
                print("パターンがマッチしませんでした。")
            player = Player(number=number, name=name, position=position,
                            height=height, weight=weight, age=age)
            playerList.append(player)
    print(playerList)

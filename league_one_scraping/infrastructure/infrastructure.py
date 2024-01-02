from dataclasses import dataclass
import requests
from bs4 import BeautifulSoup
import re


@dataclass
class Player:
    number: int
    name: str
    position: str
    height: int
    weight: int
    age: int


@dataclass()
class Game:
    id: str
    basic_info: str
    date: str
    host_team: str
    stadium: str
    spectator: int
    weather: str
    home_team: str
    away_team: str
    home_team_score: int
    home_team_player_list: [Player]
    away_team_score: int
    away_team_player_list: [Player]
    referee_name: str


# ================= Variables ========================
info_selector = "#container > header > div.title > h2"
host_team_selector = "#info > table.info1 > tr:nth-child(5) > td"
stadium_selector = "#info > table.info1 > tr:nth-child(2) > td:nth-child(2)"
spectator_selector = "#info > table.info1 > tr:nth-child(2) > td:nth-child(4)"
weather_selector = "#info > table.info1 > tr:nth-child(3) > td:nth-child(2)"
game_date_selector = "#info > table.info1 > tr:nth-child(1) > td:nth-child(2)"
ref_selector = "#info > table.info2 > tr:nth-child(1) > td:nth-child(2)"

home_team_selector = "#team > div.team.home > table > tr > th.title"
away_team_selector = "#team > div.team.away > table > tr > th.title"

home_team_score_selector = "#team > div.result > table.score > tr:nth-child(10) > td:nth-child(1)"
away_team_score_selector = "#team > div.result > table.score > tr:nth-child(10) > td:nth-child(3)"
# ====================================================


class Infrastructure:
    @classmethod
    def get_individual_match_data(cls, game_id):
        url = f"https://league-one.jp/match/{game_id}/print"
        response = requests.get(url)

        if response.status_code == 200:
            soup = BeautifulSoup(response.content, "html.parser")
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
            home_team = soup.select_one(home_team_selector).text.strip()
            away_team = soup.select_one(away_team_selector).text.strip()
            home_team_score = int(soup.select_one(
                home_team_score_selector).text.strip())
            away_team_score = int(soup.select_one(
                away_team_score_selector).text.strip())
            ref = soup.select_one(ref_selector).text.strip()
            # 選手リストを取得
            home_team_player_list = cls.get_player_list_from_table_by_selector(
                soup, 'home')
            away_team_player_list = cls.get_player_list_from_table_by_selector(
                soup, 'away')
            game = Game(id=game_id, basic_info=info, date=game_date, host_team=host_team, stadium=stadium, spectator=spectator,
                        weather=weather, home_team=home_team, home_team_player_list=home_team_player_list, away_team=away_team, away_team_player_list=away_team_player_list, home_team_score=home_team_score, away_team_score=away_team_score, referee_name=ref)
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

    def get_player_list_from_table_by_selector(soup, team_descriptor):
        team_selector = f'#team > div.team.{team_descriptor} > table > tr'
        rows = soup.select(team_selector)
        playerList = []
        for row in rows:
            cells = row.find_all('td')
            if cells:
                number = cells[0].text.strip() if cells[0] else None
                raw_player_basic_info = cells[1].text.strip(
                ) if cells[1] else None
                # セル結合している場合はポジションを取得できないのでRe.であると判定する
                if len(cells) > 2:
                    position = cells[2].text.strip() if cells[2] else None
                else:
                    position = 'Re.'

                # 正規表現を使用して結合された文字列から情報を抽出
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
        return playerList

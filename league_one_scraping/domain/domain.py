from league_one_scraping.domain.data import *
from league_one_scraping.domain.data.game import Game
from league_one_scraping.domain.data.player import Player
from league_one_scraping.domain.data.replacement import Replacement
from league_one_scraping.domain.data.score import Score
from ..infrastructure import infrastructure
from time import sleep
import re

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


class Domain:
    @classmethod
    def get_game_info_from_year(cls, year):
        game_datas = []
        game_id_list = infrastructure.Infrastructure.get_game_id_list_from_year(
            year=year)
        for game_id in game_id_list:
            soup = infrastructure.Infrastructure.get_individual_match_data_soup(
                game_id=game_id)
            if soup:
                print(game_id)
                game = cls.parse_soup_to_game_info(soup, game_id)
                game_datas.append(game)
                sleep(1)
        return game_datas

    @classmethod
    def parse_soup_to_game_info(cls, soup, game_id):
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
        home_team_player_list = cls.parse_soup_to_player_list(
            soup, 'home')
        away_team_player_list = cls.parse_soup_to_player_list(
            soup, 'away')
        # 得点経過を取得
        score_progress = cls.parse_soup_to_score_progress(soup)
        # 選手交代情報を取得
        home_team_replacement_list = cls.parse_soup_to_player_replacement(
            soup=soup, team_descriptor='home')
        away_team_replacement_list = cls.parse_soup_to_player_replacement(
            soup=soup, team_descriptor='away')
        # 選手一時交代情報を取得
        home_team_temporary_replacement_list = cls.parse_soup_to_player_temporary_replacement(
            soup, 'home')
        away_team_temporary_replacement_list = cls.parse_soup_to_player_temporary_replacement(
            soup, 'away')
        game = Game(id=game_id, basic_info=info, date=game_date, host_team=host_team, stadium=stadium, spectator=spectator,
                    weather=weather, home_team=home_team, home_team_player_list=home_team_player_list, home_team_replacement_list=home_team_replacement_list,
                    away_team=away_team, away_team_player_list=away_team_player_list, away_team_replacement_list=away_team_replacement_list, home_team_score=home_team_score, away_team_score=away_team_score, home_team_temporary_replacement_list=home_team_temporary_replacement_list, away_team_temporary_replacement_list=away_team_temporary_replacement_list,
                    referee_name=ref, score_progress=score_progress)
        print(game)
        return game

    def parse_soup_to_player_list(soup, team_descriptor):
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

    # 反則数取得 定義不明のため保留にするか。
    def parse_soup_to_infringement_count(soup, team_descriptor):
        print('yeah')

    # 得点経過取得
    def parse_soup_to_score_progress(soup):
        score_div = soup.find(id='score')
        rows = score_div.find_all('tr')
        score_progress = []
        current_half_type = None

        for row in rows:
            th_element = row.find('th')
            # 前半か後半かをth要素をもとに判定
            if th_element and ("前半" in th_element.text or "後半" in th_element.text):
                current_half_type = "前半" if "前半" in th_element.text else "後半"

            if not th_element:
                cells = row.find_all('td')
                time = cells[0].text.strip()
                team_name = cells[1].text.strip()
                player_info = cells[2].text.strip() if cells[2] else None
                if player_info:
                    player_number = player_info.split('.')[0]
                    player_name = player_info.split('.')[1]
                else:
                    player_name = None
                    player_name = None
                score_type = cells[3].text.strip()
                host_team_score = cells[4].text.strip()
                away_team_score = cells[6].text.strip()
                score = Score(
                    time=time,
                    team_name=team_name,
                    player_number=player_number,
                    player_name=player_name,
                    score_type=score_type,
                    host_team_score=host_team_score,
                    away_team_score=away_team_score,
                    half_type=current_half_type
                )
                score_progress.append(score)
        return score_progress

    # 選手交代取得
    def parse_soup_to_player_replacement(soup, team_descriptor):
        change = soup.find(id='change')
        replacement_table = change.find(
            class_=f'{team_descriptor} change')
        rows = replacement_table.find_all('tr')
        replacement_list = []
        for row in rows:
            cells = row.find_all('td')
            if cells:
                replacement_type = cells[0].text.strip()
                raw_replacement_time = cells[1].text.strip()
                match = re.match(r"(\D+)(\d+)", raw_replacement_time)
                if match:
                    half_type = match.group(1)
                    replacement_time = int(match.group(2))
                else:
                    print("パターンがマッチしませんでした。")

                replace_from = cells[2].text.strip().split('→')[0].strip()
                replace_to = cells[2].text.strip().split('→')[1].strip()
                replacement = Replacement(type=replacement_type, half_type=half_type, time=replacement_time,
                                          from_player_number=replace_from, to_player_number=replace_to)
                replacement_list.append(replacement)
        return replacement_list

    # 選手一時交代取得
    def parse_soup_to_player_temporary_replacement(soup, team_descriptor):
        change = soup.find(id='change')
        temporary_replacement_table = change.find(
            class_=f'{team_descriptor} tmpchange')
        rows = temporary_replacement_table.find_all('tr')
        replacement_list = []
        for row in rows:
            cells = row.find_all('td')
            if cells:
                replacement_type = cells[2].text.strip()
                raw_replacement_time = cells[0].text.strip().replace(" ", "")

                match = re.match(r"(\D+)(\d+)\D*(\d+)",
                                 raw_replacement_time)
                if match:
                    half_type = match.group(1)
                    replacement_time = int(match.group(2))
                    replacement_back_time = int(match.group(3))
                else:
                    # 一時交代からそのまま交代した場合
                    match = re.match(r"(\D+)(\d+)", raw_replacement_time)
                    if match:
                        half_type = match.group(1)
                        replacement_time = int(match.group(2))
                        replacement_back_time = None
                    else:
                        print("パターンがマッチしませんでした。")

                replace_from = cells[1].text.strip().split('→')[0].strip()
                replace_to = cells[1].text.strip().split('→')[1].strip()
                replacement = Replacement(type=replacement_type, half_type=half_type, time=replacement_time, back_time=replacement_back_time,
                                          from_player_number=replace_from, to_player_number=replace_to)
                replacement_list.append(replacement)
        return replacement_list

    # カード取得
    def parse_soup_to_card_for_penalty(soup, team_descriptor):
        print('yeah')

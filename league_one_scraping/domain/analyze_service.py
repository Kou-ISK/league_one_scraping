import pandas as pd


class AnalyzeService:
    def create_table():
        file_path = "/Users/isakakou/Desktop/2023_league_one_game_data.json"
        df = pd.read_json(file_path)
        pd.set_option('display.max_columns', 1000)
        columns = ["id",
                   "basic_info",
                   "date",
                   "stadium",
                   "spectator",
                   "weather",
                   "home_team",
                   "away_team",
                   "home_team_score",
                   "away_team_score",
                   "referee_name"]
        # df[columns].to_excel(
        #     '/Users/isakakou/Desktop/2023_league_one_game_data.xlsx', sheet_name='new_sheet_name')
        get_score_progress(df)


def get_score_progress(df):
    for index, row in df.iterrows():
        print(row['score_progress'])

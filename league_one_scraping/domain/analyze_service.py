import pandas as pd


class AnalyzeService:
    @classmethod
    def create_table(cls):
        file_path = "/Users/isakakou/Desktop/2023_league_one_game_data.json"
        cls.df = pd.read_json(file_path)
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

    @classmethod
    def get_score_progress_by_id(cls, id):
        # TODO 配列をdataframe形式にする
        score_progress = cls.df.loc[cls.df["id"] == id].score_progress
        print(score_progress)
        return score_progress

    def get_score_progress(self):
        for index, row in self.df.iterrows():
            df = pd.DataFrame(row['score_progress'])
            print(df)

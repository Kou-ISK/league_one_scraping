import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path

# フォント設定
plt.rcParams['font.family'] = 'Hiragino Sans'


class AnalyzeService:
    @classmethod
    def create_table(cls, year):
        file_path = Path(
            f'./datas/{year}_league_one_game_data.json').resolve()
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
        score_progress = cls.df.loc[cls.df["id"]
                                    == id].score_progress.values[0]
        df = pd.DataFrame(score_progress)
        return df

    @classmethod
    def get_team_names_by_id(cls, id):
        game = cls.df.loc[cls.df["id"] == id]
        return {"home_team_name": game.home_team.values[0], "away_team_name": game.away_team.values[0]}

    def get_score_progress(self):
        for index, row in self.df.iterrows():
            df = pd.DataFrame(row['score_progress'])
            print(df)

    # 横軸を時間にしたい。前半と後半で分けてグラフに起こす？
    def create_score_progress_graph(home_team_name, away_team_name, df):
        df[['home_team_score', 'away_team_score']] = df[[
            'home_team_score', 'away_team_score']].apply(pd.to_numeric)
        df[['home_team_score', 'away_team_score']].plot()
        plt.legend([home_team_name, away_team_name],
                   prop={'family': 'Hiragino Sans'})
        plt.show()

    @classmethod
    def create_team_spectator_graph(cls):
        team_list = cls.df['home_team'].drop_duplicates()
        df = cls.df.sort_values(by='date')
        for team in team_list:
            team_data = df[df['home_team'] == team]
            plt.plot(team_data['date'], team_data['spectator'], label=team)

        plt.legend(prop={'family': 'Hiragino Sans'})
        plt.xticks(rotation=45)
        plt.show()

    @classmethod
    def create_team_total_spectator_bar_graph(cls):
        team_totals = cls.df.groupby('home_team')['spectator'].sum()
        print(team_totals)
        plt.bar(team_totals.index, team_totals.values)
        plt.xlabel('Team')
        plt.ylabel('Total Spectators')
        plt.title('Total Spectators by Team')
        plt.xticks(rotation=45, ha='right')

        plt.legend(prop={'family': 'Hiragino Sans'})

        plt.show()

    @classmethod
    def create_stadium_total_spectator_bar_graph(cls):
        stadium_totals = cls.df.groupby('stadium')['spectator'].sum()
        print(stadium_totals)
        plt.bar(stadium_totals.index, stadium_totals.values)
        plt.xlabel('Stadium')
        plt.ylabel('Total Spectators')
        plt.title('Total Spectators by Stadium')
        plt.xticks(rotation=45, ha='right')

        plt.legend(prop={'family': 'Hiragino Sans'})

        plt.show()

from .application import application
from .domain import analyze_service


def main():
    # year = 2023
    # game_id = 25559

    application.Application.get_game_info_from_year()
    # analyzeService = analyze_service.AnalyzeService
    # analyzeService.create_table(year=year)
    # score_progress_df = analyzeService.get_score_progress_by_id(game_id)
    # df = analyzeService.get_score_progress_by_id(game_id)
    # print(df)
    # team_names = analyzeService.get_team_names_by_id(game_id)
    # print(team_names)
    # analyzeService.create_score_progress_graph(
    #     home_team_name=team_names['home_team_name'], away_team_name=team_names['away_team_name'], df=score_progress_df)
    # analyzeService.create_team_spectator_graph()
    # analyzeService.create_team_total_spectator_bar_graph()
    # analyzeService.create_stadium_total_spectator_bar_graph()


if __name__ == '__main__':
    main()

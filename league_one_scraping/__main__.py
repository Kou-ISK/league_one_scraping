import sys
from .application import application
from .domain import analyze_service


def main(args):
    print("実行中")
    print(args)
    function = args[1]
    if (function == 'getInfo'):
        year = args[2]
        application.Application.get_game_info_from_year(year)

    if (function == 'analyze'):
        print('準備中')
        year = args[2]
        analyzeService = analyze_service.AnalyzeService
        analyzeService.create_table(year=year)

    if (function == 'updateMaster'):
        application.Application.update_master_data()
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
    args = sys.argv
    main(args)

from .application import application
from .domain import analyze_service


def main():
    analyzeService = analyze_service.AnalyzeService
    analyzeService.create_table()
    analyzeService.get_score_progress_by_id(25557)
    # application.Application.get_game_info_from_year()


if __name__ == '__main__':
    main()

from .application import application
from .domain import analyze_service


def main():
    analyze_service.AnalyzeService.create_table()
    # application.Application.get_game_info_from_year()


if __name__ == '__main__':
    main()

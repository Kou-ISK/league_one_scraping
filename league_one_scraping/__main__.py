from .application import application


def main():
    application.Application.get_game_info_from_year(2022)


if __name__ == '__main__':
    main()
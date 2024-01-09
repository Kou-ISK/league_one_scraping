from .application import application


def main():
    year_input = input("Which year?")
    application.Application.get_game_info_from_year(year_input)
    print('Job Completed')


if __name__ == '__main__':
    main()

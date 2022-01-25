import requests
import json


class Data:
    def __init__(self, path):
        self.path = path

    def addRating(self, listRating):
        with open(f"{self.path}/ratings.csv", 'a+') as file:
            for e in listRating:
                file.write(
                    f"{e.userId},{e.movieId},{e.rating},{e.timestamp}\n")

    def addNewMovie(self, lastMovieId, listTmdbId):
        with open(f"{self.path}/links.csv", 'a+') as fLink:
            with open(f"{self.path}/movies.csv", 'a+') as fMovie:
                for idx, val in enumerate(listTmdbId):
                    movieId = int(lastMovieId)+idx+1
                    response = requests.get(
                        f'https://api.themoviedb.org/3/movie/{val}?api_key=7e45a30bcb576d87b9f1c53ca284faf0')
                    data = json.loads(response.text)
                    fLink.write(f"{movieId},{data['imdb_id'][2:]},{val}\n")
                    fMovie.write(
                        f"{movieId},{data['title']} ({data['release_date'].split('-')[0]}),{'|'.join([e['name'] for e in data['genres']])}\n")

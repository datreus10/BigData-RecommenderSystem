class Data:
    def __init__(self, path):
        self.path = path

    def addRating(self, listRating):
        with open(f"{self.path}/ratings.csv", 'a+') as file:
            for e in listRating:
                file.write(f"\n{e.userId},{e.movieId},{e.rating},{e.timestamp}")

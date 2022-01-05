class Data:
    def addRating(self, listRating):
        with open("./data/ml-25m/ratings.csv", 'a+') as file:
            for e in listRating:
                file.write(f"\n{e.userId},{e.movieId},{e.rating},{e.timestamp}")

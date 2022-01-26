from pyspark.ml.recommendation import ALS
from pyspark.sql import functions as f
from data import Data


class RecommendationEngine:

    def __init__(self, spark, dataset_path):
        self.spark = spark
        self.dataset_path = dataset_path
        self.dataset = Data(dataset_path)
        self.load_data()
        self.train_model()

    def LoadLinkData(self):
        self.linkData = (
            self.spark.read.csv(
                path=f"{self.dataset_path}/links.csv",
                sep=",", header=True, quote='"', schema="movieId INT, imdbId STRING, tmdbId STRING",
            ).select("movieId", "tmdbId")
            .cache()
        )

    def LoadRatingData(self):
        self.ratingData = (
            self.spark.read.csv(
                path=f"{self.dataset_path}/ratings.csv",
                sep=",", header=True, quote='"', schema="userId INT, movieId INT, rating DOUBLE, timestamp INT",
            ).select("userId", "movieId", "rating")
            .cache()
        )

    def load_data(self, opt=-1):
        if opt == 0:
            self.ratingData.unpersist()
            self.LoadRatingData()
        elif opt == 1:
            self.linkData.unpersist()
            self.LoadLinkData()
        else:
            if hasattr(self, 'ratingData'):
                self.ratingData.unpersist() # refresh dataframe
            if hasattr(self, 'linkData'):
                self.linkData.unpersist()
            self.LoadRatingData()
            self.LoadLinkData()


    def train_model(self):
        als = ALS(
            userCol="userId",
            itemCol="movieId",
            ratingCol="rating",
        )
        self.model = als.fit(self.ratingData)

    def getRatingForUser(self, userId, limit):
        ratedMovies = self.ratingData.filter(f.col('userId') == userId).select(
            'movieId').rdd.flatMap(lambda x: x).collect()

        movies_to_be_rated = (
            self.linkData.filter(~ f.col('movieId').isin(ratedMovies))
            .select('movieId').distinct().withColumn('userId', f.lit(userId))
        )

        user_movie_predictions = self.model.transform(movies_to_be_rated)
        result = user_movie_predictions.filter(
            ~f.isnan('prediction') & (user_movie_predictions.prediction <= 5)).orderBy('prediction', ascending=False).limit(limit).join(self.linkData, ['movieId'], 'left')

        return result.select('movieId', 'prediction', 'tmdbId').toPandas().to_dict('list')

    def getRandomMovie(self, number):
        return self.linkData.orderBy(f.rand()).limit(number).toPandas().to_dict('list')
        # return self.linkData.sample(withReplacement=False, fraction=0.8).limit(number).toPandas().to_dict('list')

    def convertToTmdbId(self, listMovieId):
        return self.linkData.filter(self.linkData.movieId.isin(listMovieId)).toPandas().to_dict('list')

    def convertToMovieId(self, listTmdbId):
        # find list tmdbid not in file
        # tmp = df_tmdbId.join(self.linkData, on=['tmdbId'], how='left_anti').select(
        #     'tmdbId').rdd.map(lambda row: row[0]).collect()
        existElement = self.linkData.filter(self.linkData.tmdbId.isin(listTmdbId)).select('tmdbId').rdd.map(lambda row: row[0]).collect()
        tmp = [e for e in listTmdbId if e not in existElement]

        # if exist insert to file
        if len(tmp) > 0:
            lastMovieId = self.linkData.tail(1)[0]['movieId']
            self.dataset.addNewMovie(lastMovieId, tmp)
            self.load_data(1)

    
        data = self.linkData.filter(self.linkData.tmdbId.isin(
            listTmdbId)).toPandas().to_dict('list')
        
        return data

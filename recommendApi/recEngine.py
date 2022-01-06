from pyspark.ml.recommendation import ALS
from pyspark.sql import functions as f



class RecommendationEngine:

    def __init__(self, spark, dataset_path):
        self.spark = spark

        self.ratingData = (
            self.spark.read.csv(
                path=f"{dataset_path}/ratings_small.csv",
                sep=",", header=True, quote='"', schema="userId INT, movieId INT, rating DOUBLE, timestamp INT",
            ).select("userId", "movieId", "rating")
            .cache()
        )

        self.linkData = (
            spark.read.csv(
                path=f"{dataset_path}/links_small.csv",
                sep=",", header=True, quote='"', schema="movieId INT, imdbId STRING, tmdbId STRING",
            ).select("movieId", "tmdbId")
            .cache()
        )

        self.train_model()

    def train_model(self):
        als = ALS(
            userCol="userId",
            itemCol="movieId",
            ratingCol="rating",
        )
        (training_data, validation_data) = self.ratingData.randomSplit(
            [8.0, 2.0])
        self.model = als.fit(training_data)

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
        #return self.linkData.sample(withReplacement=False, fraction=0.8).limit(number).toPandas().to_dict('list')

    def convertToTmdbId(self, listMovieId):
        return self.linkData.filter(self.linkData.movieId.isin(listMovieId)).toPandas().to_dict('list')

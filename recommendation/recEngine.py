import findspark
findspark.init()

import json
import sys
from pyspark.ml.recommendation import ALS, ALSModel
from pyspark.sql import functions as f
from pyspark.sql import SparkSession
from pyspark.mllib.recommendation import ALS, MatrixFactorizationModel, Rating



try:
    spark = SparkSession.builder \
        .master('local[*]') \
        .config("spark.driver.memory", "5g") \
        .appName('movieRecommendationPySpark') \
        .getOrCreate()
    model = ALSModel.load("./recommendation/modelRecBest")

    # with open("./data/ml-25m/test.csv", 'a+') as file:
    #     file.write('\n5,3113,3.4,1147868510')
    #     file.close()

    ratings = (
        spark.read.csv(
            path="./data/ml-25m/ratings.csv",
            sep=",", header=True, quote='"', schema="userId INT, movieId INT, rating DOUBLE, timestamp INT",
        ).select("userId", "movieId", "rating")
    )

    links = (
        spark.read.csv(
            path="./data/ml-25m/links.csv",
            sep=",", header=True, quote='"', schema="movieId INT, imdbId STRING, tmdbId STRING",
        ).select("movieId", "tmdbId")
    )

    userId = int(sys.argv[1])

    ratedMovies = ratings.filter(f.col('userId') == userId).select(
        'movieId').rdd.flatMap(lambda x: x).collect()

    movies_to_be_rated = (
        ratings.filter(~ f.col('movieId').isin(ratedMovies))
        .select('movieId').distinct().withColumn('userId', f.lit(userId))
    )

    user_movie_predictions = model.transform(movies_to_be_rated)
    result = user_movie_predictions.filter(
        ~f.isnan('prediction')).orderBy('prediction', ascending=False).limit(100).join(links, ['movieId'], 'left')

    print(json.dumps(result.select('movieId', 'prediction',
          'tmdbId').toPandas().to_dict('list')))
except Exception as e:
    print("Error")
    print(e)

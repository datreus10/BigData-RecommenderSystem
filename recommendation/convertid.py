from pyspark.mllib.recommendation import ALS, MatrixFactorizationModel, Rating
from pyspark.sql import SparkSession
from pyspark.sql import functions as f
from pyspark.ml.recommendation import ALS, ALSModel
import json
import pandas;

import sys;

spark = SparkSession.builder \
    .master('local[*]') \
    .config("spark.driver.memory", "4g") \
    .appName('movieRecommendationPySpark') \
    .getOrCreate()

movies = (
    spark.read.csv(
        path = "./data/ml-25m/movies.csv",
        sep=",",
        header = True,
        quote='"',
        schema = "movieId INT, title STRING, genres STRING",
    )
)

links = (
    spark.read.csv(
        path="./data/ml-25m/links.csv",
        sep=",", header=True, quote='"', schema="movieId INT, imdbId STRING, tmdbId STRING",
    ).select("movieId","tmdbId")
)

result=movies.join(links,['movieId'],'left')

print(json.dumps(result.select('tmdbId').limit(9).toPandas().to_dict('list')))
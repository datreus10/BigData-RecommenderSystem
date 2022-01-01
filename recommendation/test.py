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
model =  ALSModel.load("./modelrecommendation")


ratings = (
    spark.read.csv(
        path = "./data/ml-25m/ratings.csv",
        sep=",", header=True,quote='"',schema="userId INT, movieId INT, rating DOUBLE, timestamp INT",
    ).select("userId", "movieId", "rating")
)
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


id = int(sys.argv[1])

ratedMovies = ratings.filter(f.col('userId')==id).select('movieId').rdd.flatMap(lambda x:x).collect()
movies_to_be_rated = (
ratings.filter(~ f.col('movieId').isin(ratedMovies))
.select('movieId').distinct().withColumn('userId',f.lit(id))
)
user_movie_predictions = model.transform(movies_to_be_rated)
movierecomment=user_movie_predictions.select('movieId').distinct()
result = user_movie_predictions.filter(
    ~f.isnan('prediction')).orderBy('prediction', ascending=False).limit(100).join(links,['movieId'],'left')
print(json.dumps(result.select('movieId','prediction','tmdbId').toPandas().to_dict('list')))


# df = result.toPandas()
# result = df.to_json(orient="values")
# parsed = json.loads(result)
# print(parsed)



from pyspark.mllib.recommendation import ALS, MatrixFactorizationModel, Rating
from pyspark.sql import SparkSession
from pyspark.sql import functions as f
from pyspark.ml.recommendation import ALS, ALSModel
import json

spark = SparkSession.builder \
    .master('local[*]') \
    .config("spark.driver.memory", "4g") \
    .appName('movieRecommendationPySpark') \
    .getOrCreate()
model =  ALSModel.load("./modelrecommendation")


with open("./data/ml-25m/test.csv", 'a+') as file:
    file.write('\n5,3113,3.4,1147868510')
    file.close()    


ratings = (
    spark.read.csv(
        path = "./data/ml-25m/test.csv",
        sep=",", header=True,quote='"',schema="userId INT, movieId INT, rating DOUBLE, timestamp INT",
    ).select("userId", "movieId", "rating")
)
# ratings.show(20)
movies = (
    spark.read.csv(
        path = "./data/ml-25m/movies.csv",
        sep=",",
        header = True,
        quote='"',
        schema = "movieId INT, title STRING, genres STRING",
    )
)


# movies.show(5,False)

ratedMovies = ratings.filter(f.col('userId')==1).select('movieId').rdd.flatMap(lambda x:x).collect()
movies_to_be_rated = (
    ratings.filter(~ f.col('movieId').isin(ratedMovies))
    .select('movieId').distinct().withColumn('userId',f.lit(1))
)
# movies_to_be_rated.show()
user_movie_predictions = model.transform(movies_to_be_rated)
# user_movie_predictions=user_movie_predictions.filter(~f.isnan('prediction')).orderBy('prediction',ascending=False).show(5)
movierecomment=user_movie_predictions.select('movieId').distinct()
#result = movierecomment.to_json(orient="split")
#print(result)
import findspark
findspark.init()

from fastapi import FastAPI
from datetime import datetime
from pyspark.ml.recommendation import ALS
from pyspark.sql import SparkSession
from pyspark.sql import functions as f
from pyspark.ml.recommendation import ALS, ALSModel
from recommendApi.recEngine import RecommendationEngine



#import recEngine

app = FastAPI()

spark = SparkSession.builder \
    .master('local[*]') \
    .config("spark.driver.memory", "5g") \
    .appName('movieRecommendationPySpark') \
    .getOrCreate()

recEngine = False


@app.get("/")
def root():
    return {"Hello": "world"}


# http://localhost:8000/movie/rec?userId=5&limit=10
@app.get("/movie/rec")
def getRec(userId: int = 1, limit: int = 50):
    global recEngine
    if not recEngine:
        recEngine = RecommendationEngine(spark, "./data/ml-25m")
    return recEngine.getRatingForUser(userId, limit)

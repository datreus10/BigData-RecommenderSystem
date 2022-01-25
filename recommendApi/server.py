import os
import findspark
findspark.init()

import uvicorn
from typing import List
from fastapi import FastAPI
from pyspark.sql import SparkSession
from pyspark.sql import functions as f
from data import Data
from recEngine import RecommendationEngine
from model import Rating

os.environ['SPARK_HOME']="C:\BigData\spark-3.0.3-bin-hadoop2.7"
os.environ['JAVA_HOME']="C:\Program Files\Java\jdk1.8.0_311"
os.environ['HADOOP_HOME']="C:\BigData\Hadoop"


#import recEngine

app = FastAPI()

spark = SparkSession.builder \
    .master('local[*]') \
    .config("spark.driver.memory", "5g") \
    .appName('movieRecommendationPySpark') \
    .getOrCreate()

recEngine = False
filePath = ".\\data\\small"


@app.get("/")
def root():
    return {"Hello": "world"}


# http://localhost:8000/movie/rec?userId=5&limit=10
@app.get("/movie/rec")
def getRec(userId: int = 1, limit: int = 50):
    global recEngine, filePath
    if not recEngine:
        recEngine = RecommendationEngine(spark, filePath)
    return recEngine.getRatingForUser(userId, limit)

@app.get("/movie/random")
def getRec(limit:int=1):
    global recEngine, filePath
    if not recEngine:
        recEngine = RecommendationEngine(spark, filePath)
    return recEngine.getRandomMovie(limit)

@app.post("/movie/rating")
def addRating(listRating: List[Rating]):
    global recEngine, filePath
    dataset = Data(filePath)
    print(listRating)
    dataset.addRating(listRating)
    if not recEngine:
        recEngine = RecommendationEngine(spark, filePath)
    else:
        print("train_model")
        recEngine.load_data()
        recEngine.train_model()
    return {"msg": "success"}


@app.post("/to_tmdbID")
def toTmdbId(listMovieId: List[str]):
    global recEngine, filePath
    if not recEngine:
        recEngine = RecommendationEngine(spark, filePath)
    return recEngine.convertToTmdbId(listMovieId)

@app.post("/to_movieID")
def toMovieId(listTmdbId: List[str]):
    global recEngine, filePath
    if not recEngine:
        recEngine = RecommendationEngine(spark, filePath)
    return recEngine.convertToMovieId(listTmdbId)


if __name__ == "__main__":
    uvicorn.run("server:app", reload=True, host="localhost", port=8000)

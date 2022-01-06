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



#import recEngine

app = FastAPI()

spark = SparkSession.builder \
    .master('local[*]') \
    .config("spark.driver.memory", "5g") \
    .appName('movieRecommendationPySpark') \
    .getOrCreate()

recEngine = False
filePath = ".\\data\\data-small"


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
    dataset.addRating(listRating)
    if not recEngine:
        recEngine = RecommendationEngine(spark, filePath)
    else:
        recEngine.train_model()
    return {"msg": "success"}


@app.post("/to_tmdbID")
def toTmdbId(listMovieId: List[str]):
    print(listMovieId)
    global recEngine, filePath
    if not recEngine:
        recEngine = RecommendationEngine(spark, filePath)
    return recEngine.convertToTmdbId(listMovieId)


if __name__ == "__main__":
    uvicorn.run("server:app", reload=True, host="localhost", port=8000)

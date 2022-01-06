import findspark
findspark.init()

from model import Rating
from recEngine import RecommendationEngine
from data import Data
from pyspark.sql import functions as f
from pyspark.sql import SparkSession
from fastapi import FastAPI
from typing import List
import uvicorn



#import recEngine

app = FastAPI()

spark = SparkSession.builder \
    .master('local[*]') \
    .config("spark.driver.memory", "5g") \
    .appName('movieRecommendationPySpark') \
    .getOrCreate()

recEngine = False
filePath=".\\data\\data-small"

@app.get("/")
def root():
    return {"Hello": "world"}


# http://localhost:8000/movie/rec?userId=5&limit=10
@app.get("/movie/rec")
def getRec(userId: int = 1, limit: int = 50):
    global recEngine,filePath
    if not recEngine:
        recEngine = RecommendationEngine(spark, filePath)
    return recEngine.getRatingForUser(userId, limit)


@app.post("/movie/rating")
def addRating(listRating:List[Rating]):
    global recEngine,filePath
    dataset = Data(filePath)
    dataset.addRating(listRating)
    if not recEngine:
        recEngine = RecommendationEngine(spark, filePath)
    else:
        recEngine.train_model()
    return {"msg":"success"}


if __name__ == "__main__":
    uvicorn.run("server:app", reload=True, host="localhost", port=8000)

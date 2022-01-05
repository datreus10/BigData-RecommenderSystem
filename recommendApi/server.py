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

@app.post("/movie/rating")
def addRating(listRating:List[Rating]):
    dataset = Data()
    dataset.addRating(listRating)
    global recEngine
    if not recEngine:
        recEngine = RecommendationEngine(spark, "./data/ml-25m")
    else:
        recEngine.train_model()
    return {"Hello":"World"}


if __name__ == "__main__":
    uvicorn.run("server:app", reload=True, host="localhost", port=8000)

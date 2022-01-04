import findspark
findspark.init()

from recEngine import RecommendationEngine
from pyspark.ml.recommendation import ALS, ALSModel
from pyspark.sql import functions as f
from pyspark.sql import SparkSession
from pyspark.ml.recommendation import ALS
from datetime import datetime
from fastapi import FastAPI
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


if __name__ == "__main__":
    uvicorn.run("server:app", reload=True, host="localhost", port=8000)

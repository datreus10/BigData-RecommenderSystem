import findspark
findspark.init()

import sys
import pandas
import json
from pyspark.ml.recommendation import ALS, ALSModel
from pyspark.sql import functions as f
from pyspark.sql import SparkSession
from pyspark.mllib.recommendation import ALS, MatrixFactorizationModel, Rating



def loadcsv(spark, filename):
    data = (
        spark.read.csv(
            path=f"./data/ml-25m/{filename}.csv",
            sep=",",
            header=True,
            quote='"',
        )
    )
    return data


def avgRating(spark, movieIds):
    df = loadcsv(spark, 'ratings')
    print(df.filter(df['movieId'].isin(movieIds)).groupby('movieId').agg(
        f.avg('rating').alias('avg')).toPandas().to_json(orient='split'))


if __name__ == "__main__":
    spark = SparkSession.builder \
        .master('local[*]') \
        .config("spark.driver.memory", "4g") \
        .appName('movieRecommendationPySpark') \
        .getOrCreate()
  
    if(sys.argv[1]=="homePage"):
        avgRating(spark, [int(e) for e in sys.argv[2].split(',')])


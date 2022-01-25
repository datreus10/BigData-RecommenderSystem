from pydantic import BaseModel
from typing import List, Optional
import time


class Rating(BaseModel):
    userId: str
    movieId: str
    rating: str
    timestamp: int = int(time.time())

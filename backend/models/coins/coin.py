from datetime import datetime

from bson import ObjectId

from models.base_entity import BaseEntity


class Coin(BaseEntity):
    current: float
    user_id: ObjectId
    coin_per_hour: float
    last_visit: datetime.datetime
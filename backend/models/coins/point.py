from datetime import datetime

from bson import ObjectId

from models.base_entity import BaseEntity


class Point(BaseEntity):
    current_coin: float
    user_id: ObjectId
    coin_per_hour: float
    speed: float
    stamina: float
    regeneration: float

    points_bonus: float

    current_water: float

    current_path: int
    last_visit: datetime

import datetime

from pydantic import BaseModel

from models.base_entity import BaseEntity


class User(BaseEntity):
    telegram_id: int
    username: str
    role: str
    created_date: datetime.datetime


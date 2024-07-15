import datetime
from typing import Optional

from bson import ObjectId
from pydantic import BaseModel

from models.base_entity import BaseEntity
from models.missions.mission_status import MissionStatus


class UserMission(BaseEntity):
    user_id: ObjectId
    mission_id: ObjectId
    status: str
    complete_date: Optional[datetime.datetime]

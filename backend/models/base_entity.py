from bson import ObjectId
from pydantic import BaseModel


class BaseEntity(BaseModel):
    id: ObjectId = ObjectId()

    class Config:
        json_encoders = {
            ObjectId: str
        }
        arbitrary_types_allowed = True

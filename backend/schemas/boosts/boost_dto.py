from pydantic import BaseModel

from models.base_entity import BaseEntity


class BoostDto(BaseModel):
    boost_id: str
    lvl: int

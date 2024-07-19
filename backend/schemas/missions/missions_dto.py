from typing import List

from pydantic import BaseModel


class UserMissionDto(BaseModel):
    id: str
    name: str
    reward: float
    link: str
    status: str
    icon_type: str


class UserMissionDataDto(BaseModel):
    completed: int
    data: List[UserMissionDto]

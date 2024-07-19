from pydantic import BaseModel

from models.base_entity import BaseEntity


class Mission(BaseEntity):
    name: str
    reward: float
    link: str
    icon_type: str
    chat_id: str

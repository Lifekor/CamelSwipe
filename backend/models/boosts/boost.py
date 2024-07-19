from models.base_entity import BaseEntity


class Boost(BaseEntity):
    reward: float
    boost_type: int
    description: str

from models.base_entity import BaseEntity


class Boost(BaseEntity):
    prices = [1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 256000, 512000]
    reward: float
    
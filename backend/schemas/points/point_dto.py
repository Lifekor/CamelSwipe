from pydantic import BaseModel

class CurrentCointDto(BaseModel):
    current_coin: float
class PointDto(BaseModel):
    current_coin: float
    coin_per_hour: float
    speed: float
    stamina: float
    regeneration: float
    current_water: float
    current_path: float

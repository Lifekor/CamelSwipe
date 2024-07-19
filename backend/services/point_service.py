from bson import ObjectId

from config.collections import Collections
from config.database import db
from exceptions.custom_exception import CustomException
from schemas.points.point_dto import PointDto


class PointService:
    point_collection = db[Collections.COINS]
    user_collection = db[Collections.USERS]

    async def get_async(self, user_id: int):
        user = await self._get_user_async(user_id=user_id)
        point = await self.point_collection.find_one({'user_id': ObjectId(user['_id'])})

        return PointDto(current_coin=point['current_coin'],
                        coin_per_hour=point['coin_per_hour'],
                        speed=point['speed'],
                        stamina=point['stamina'],
                        regeneration=point['regeneration'],
                        current_water=point['current_water'],
                        current_path=point['current_path'])

    async def _get_user_async(self, user_id: int):
        user = await self.user_collection.find_one({'telegram_id': user_id})
        if not user:
            raise CustomException('User not found')

        return user
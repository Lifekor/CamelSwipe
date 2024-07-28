import datetime

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
        seconds = (datetime.datetime.utcnow() - point['last_visit']).total_seconds()
        points_farmed = int(seconds // 6)

        point['current_water'] += points_farmed
        if point['current_water'] > 1000:
            point['current_water'] = 1000

        await self.point_collection.update_one(
                {"_id": point['_id']},
                {"$set": point}
            )
        return PointDto(current_coin=point['current_coin'],
                        coin_per_hour=point['coin_per_hour'],
                        speed=point['speed'],
                        stamina=point['stamina'],
                        regeneration=point['regeneration'],
                        current_water=point['current_water'],
                        current_path=point['current_path'])


    async def claim_async(self, user_id: int, current_path: float, coin: float):
        user = await self._get_user_async(user_id=user_id)
        point = await self.point_collection.find_one({'user_id': ObjectId(user['_id'])})

        point['current_coin'] += coin
        point['current_path'] = current_path
        point['current_water'] -= 1

        point['last_visit'] = datetime.datetime.utcnow()
        await self.point_collection.update_one(
            {"_id": point['_id']},
            {"$set": point}
        )

    async def watter_point(self, user_id: int, watter_per_sec: float):
        user = await self._get_user_async(user_id=user_id)
        point = await self.point_collection.find_one({'user_id': ObjectId(user['_id'])})

        point['current_water'] += watter_per_sec
        await self.point_collection.update_one(
            {"_id": point['_id']},
            {"$set": point}
        )

    async def _get_user_async(self, user_id: int):
        user = await self.user_collection.find_one({'telegram_id': user_id})
        if not user:
            raise CustomException('User not found')

        return user
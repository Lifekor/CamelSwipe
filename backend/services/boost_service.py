from bson import ObjectId

from config.collections import Collections
from config.database import db
from exceptions.custom_exception import CustomException


class BoostService:
    user_collection = None
    boost_collection = None
    user_boost_collection = None
    coin_collection = None

    def __init__(self):
        self.user_collection = db[Collections.USERS]
        self.coin_collection = db[Collections.COINS]
        self.boost_collection = db[Collections.BOOSTS]
        self.user_boost_collection = db[Collections.BOOSTS]

    async def get_async(self, user_id: str):
        boosts = await self.user_boost_collection.find({'user_id': ObjectId(user_id)}).to_list(length=None)
        return boosts

    async def buy_boost_async(self, user_id: str, user_boost_id: str):
        await self._get_user_async(user_id=user_id)
        user_boost = await self.user_boost_collection.find_one({'_id': ObjectId(user_boost_id)})
        if not user_boost:
            raise CustomException('Boost not found')

        boost = await self.boost_collection.find_one({'_id': ObjectId(user_boost['boost_id'])})
        if not boost:
            raise CustomException('Boost not found')

        user_coin = await self.coin_collection(user_id=user_boost['user_id'])

        if user_coin['coin'] < user_boost['next_price']:
            raise CustomException("Not enough coin")

        max_lvl = 10
        if user_boost['lvl'] == max_lvl:
            raise CustomException("Already got max boost lvl")

        user_coin['coin'] -= user_boost['next_price']
        user_coin['coin_per_hour'] += boost['prices'].index(user_coin['next_price'])

    async def _get_user_async(self, user_id: str):
        user = await self.user_collection.find_one({'_id': ObjectId(user_id)})
        if not user:
            raise CustomException('User not found')

        return user

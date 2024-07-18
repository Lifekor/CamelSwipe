from bson import ObjectId

from config.collections import Collections
from config.database import db
from exceptions.custom_exception import CustomException
from models.boosts.boost_status import BoostType


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

    async def buy_boost_async(self, user_id: str, boost_id: str):
        user = await self._get_user_async(user_id=user_id)
        boost = await self.boost_collection.find_one({'_id': ObjectId(boost_id)})
        if not boost:
            raise CustomException('Boost not found')

        user_boost = await self.user_boost_collection.find_one({'_id': ObjectId(boost['_id'])})
        if not user_boost:
            raise CustomException('Boost not found')

        user_coin = await self.coin_collection(user_id=user_boost['user_id'])

        if user_coin['coin'] < user_boost['next_price']:
            raise CustomException("Not enough coin")

        max_lvl = 10
        if user_boost['lvl'] == max_lvl:
            raise CustomException("Already got max boost lvl")

        user_coin['coin'] -= user_boost['next_price']
        boost_type = BoostType(boost['boost_type'])
        await self._set_reward_async(user=user, boost_type=boost_type)

    async def _set_reward_async(self, user, boost_type: BoostType, reward):
        user_point = await self.coin_collection.find_one({'user_id': user['_id']})
        if boost_type == BoostType.Speed:
            user_point['speed'] += reward
        elif boost_type == BoostType.PointBonus:
            user_point['stamina'] += reward
        elif boost_type == BoostType.Regeneration:
            user_point['regeneration'] += reward
        elif boost_type == BoostType.PointBonus:
            user_point['points_bonus'] += reward

    async def _get_user_async(self, user_id: str):
        user = await self.user_collection.find_one({'_id': ObjectId(user_id)})
        if not user:
            raise CustomException('User not found')

        return user

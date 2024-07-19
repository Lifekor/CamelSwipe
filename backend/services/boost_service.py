from bson import ObjectId

from config.collections import Collections
from config.database import db
from exceptions.custom_exception import CustomException
from models.boosts.boost_status import BoostType
from schemas.boosts.boost_dto import BoostDto

prices = [1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 256000, 512000]


class BoostService:
    user_collection = None
    boost_collection = None
    user_boost_collection = None
    coin_collection = None

    def __init__(self):
        self.user_collection = db[Collections.USERS]
        self.coin_collection = db[Collections.COINS]
        self.boost_collection = db[Collections.BOOSTS]
        self.user_boost_collection = db[Collections.USER_BOOST]

    async def get_async(self, user_id: str):
        boosts = await self.user_boost_collection.find({'user_id': ObjectId(user_id)}).to_list(length=None)
        dtos = []

        for user_boost in boosts:
            boost = await self.boost_collection.find_one({'_id': ObjectId(user_boost['boost_id'])})
            boost_type = BoostType(boost['boost_type'])
            next = 0
            if user_boost['lvl'] < 10:
                next = prices[user_boost['lvl']]
            boost = BoostDto(boost_id=str(boost['_id']), lvl=user_boost['lvl'], description=boost['description'], type=boost_type.name,
                             price=next)
            dtos.append(boost)

        return dtos

    async def buy_boost_async(self, user_id: str, boost_id: str):
        user = await self._get_user_async(user_id=user_id)
        boost = await self.boost_collection.find_one({'_id': ObjectId(boost_id)})
        if not boost:
            raise CustomException('Boost not found')

        user_boost = await self.user_boost_collection.find_one({'user_id': ObjectId(user['_id'])})
        if not user_boost:
            raise CustomException('Boost not found')

        user_coin = await self.coin_collection.find_one({'user_id' :ObjectId(user_id)})
        max_lvl = 10

        if user_boost['lvl'] > len(prices) - 1 or user_coin['current_coin'] < prices[user_boost['lvl']]:
            raise CustomException("Not enough coin")

        if user_boost['lvl'] == max_lvl:
            raise CustomException("Already got max boost lvl")

        user_coin['current_coin'] -= prices[user_boost['lvl']]
        user_boost['lvl'] += 1
        boost_type = BoostType(boost['boost_type'])
        await self._set_reward_async(user_point=user_coin, boost_type=boost_type, reward=boost['reward'])
        await self.coin_collection.update_one(
            {'_id': ObjectId(user_coin['_id'])},
            {'$set': user_coin}
        )
        await self.user_boost_collection.update_one(
            {'_id': ObjectId(user_boost['_id'])},
            {'$set': user_boost}
        )

    async def _set_reward_async(self, user_point: dict, boost_type: BoostType, reward: float):
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

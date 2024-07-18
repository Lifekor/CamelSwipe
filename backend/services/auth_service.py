import datetime
from typing import Collection

from bson import ObjectId

from config.collections import Collections
from config.database import db
from models.boosts.user_boost import UserBoost
from models.coins.point import Point
from models.users.user import User
from schemas.auth.sign_in_response import SignInResponse


class AuthService:
    user_collection = None
    boost_collection = None
    user_boost_collection = None
    coin_collection = None

    def __init__(self):
        self.user_collection = db[Collections.USERS]
        self.user_boost_collection = db[Collections.USER_BOOST]
        self.boost_collection = db[Collections.BOOSTS]
        self.coin_collection = db[Collections.COINS]

    async def sign_in_async(self, user_id: int, username: str) -> SignInResponse:  #todo передать под jwt auth с новых проктов
        user = await self.user_collection.find_one({"telegram_id": user_id})
        if user is None:
            guid, role = await self._create_user_async(user_id=user_id, username=username)
            result = SignInResponse(user_id=guid, role=role)
            return result

        result = SignInResponse(user_id=str(user['_id']), role=user['role'])
        return result

    async def _create_user_async(self, user_id: int, username: str):
        role = 'user'
        user = User(telegram_id=user_id, username=username, role=role, created_date=datetime.datetime.utcnow())
        result = await self.user_collection.insert_one(dict(user))
        await self.coin_collection.insert_one(dict(Point(current_coin=0,
                                                                user_id=ObjectId(result.inserted_id),
                                                                coin_per_hour=0,
                                                                speed=0,
                                                                stamina=0,
                                                                regeneration=0,
                                                                points_bonus=0,
                                                                last_visit=datetime.datetime.utcnow())))
        boosts = await self.boost_collection.find().to_list(length=None)
        for boost in boosts:
            user_boost = UserBoost(boost_id=ObjectId(boost['_id']),
                                   lvl=0,
                                   user_id=ObjectId(result.inserted_id))
            await self.user_boost_collection.insert_one(dict(user_boost))

        return str(result.inserted_id), user.role

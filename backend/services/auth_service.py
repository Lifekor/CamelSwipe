import datetime
from typing import Collection

from config.collections import Collections
from config.database import db
from models.users.user import User
from schemas.auth.sign_in_response import SignInResponse


class AuthService:
    user_collection = None

    def __init__(self):
        self.user_collection = db[Collections.USERS]

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
        return str(result.inserted_id), user.role

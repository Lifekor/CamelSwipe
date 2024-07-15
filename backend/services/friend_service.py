import datetime

from bson import ObjectId

from config.collections import Collections
from config.database import db
from exceptions.custom_exception import CustomException
from models.friends.friend import Friend
from models.missions.mission_status import MissionStatus
from models.missions.user_missions import UserMission
from schemas.friends.friends_dto import FriendsDataDto, FriendsDto


class FriendsService:
    friends_collection = None
    user_collection = None
    user_mission_collection = None
    mission_collection = None

    def __init__(self):
        self.friends_collection = db[Collections.FRIENDS]
        self.user_collection = db[Collections.USERS]
        self.mission_collection = db[Collections.MISSIONS]
        self.user_mission_collection = db[Collections.USER_MISSIONS]

    async def get_async(self, user_id: str) -> FriendsDto:
        user = await self._get_user_async(user_id=user_id)
        friends = await self.friends_collection.find({'inviter_id': user['telegram_id']}).to_list(length=None)

        result = []
        for friend in friends:
            result.append(FriendsDataDto(inviter_id=friend['inviter_id'],
                                         referral_username=friend['referral_username'],
                                         missions_finished=friend['missions_finished']))

        inviter_name = ""
        user_inviter = await self.friends_collection.find_one({'referral_id': user['telegram_id']})
        if user_inviter is not None:
            user_inivter_data = await self.user_collection.find_one({'telegram_id': user_inviter['inviter_id']})
            if user_inivter_data is not None:
                inviter_name = user_inivter_data['username']
        return FriendsDto(data=result, user_inviter=inviter_name)


    async def add_new_referral_async(self, inviter_id: int, referral_id: int, referral_username: str):
        user = await self.user_collection.find_one({'telegram_id': inviter_id})
        if not user:
            raise CustomException('Inviter user not found')

        user_friends = await self.friends_collection.find({'inviter_id': inviter_id}).to_list(length=None)

        for friend in user_friends:
            if friend['referral_id'] == referral_id:
                raise CustomException('Referral already exist')

            user_referral = await self.user_collection.find_one({'telegram_id': friend['referral_id']})
            if not user_referral:
                raise CustomException('Referral already exist')

        friend = Friend(inviter_id=inviter_id,
                        referral_username=referral_username,
                        referral_id=referral_id,
                        date_added=datetime.datetime.utcnow(),
                        missions_finished=0)

        await self.friends_collection.insert_one(dict(friend))
        mission = await self.mission_collection.find_one({'icon_type': "Friend"})
        if mission is None:
            return

        user_mission = await self.mission_collection.find_one({'mission_id': ObjectId(mission['_id'])})
        if user_mission is None:
            user_mission = UserMission(
                user_id=ObjectId(user['_id']),
                mission_id=ObjectId(mission['_id']),
                status=MissionStatus.Verified.value,
                complete_date=None
            )
            await self.user_mission_collection.insert_one(dict(user_mission))
        else:
            user_mission['status'] = MissionStatus.Verified.value
            await self.user_mission_collection.update_one(
                {'_id': ObjectId(user_mission['_id'])},
                {'$set': user_mission}
            )

    async def _get_user_async(self, user_id: str):
        user = await self.user_collection.find_one({'_id': ObjectId(user_id)})
        if not user:
            raise CustomException('User not found')

        return user

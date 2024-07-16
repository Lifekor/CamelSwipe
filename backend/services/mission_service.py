import datetime
import time

import requests
from bson import ObjectId

from config.collections import Collections
from config.database import db
from exceptions.custom_exception import CustomException
from models.missions.mission import Mission
from models.missions.mission_status import MissionStatus
from models.missions.user_missions import UserMission
from schemas.missions.missions_dto import UserMissionDataDto, UserMissionDto

BOT_TOKEN = 'BOT token from os' #TODO


class MissionService:
    friends_collection = None
    user_mission_collection = None
    user_collection = None
    mission_collection = None

    def __init__(self):
        self.mission_collection = db[Collections.MISSIONS]
        self.user_mission_collection = db[Collections.USER_MISSIONS]
        self.user_collection = db[Collections.USERS]
        self.friends_collection = db[Collections.FRIENDS]

    async def get_async(self, user_id: str) -> UserMissionDataDto:
        missions = await self.mission_collection.find().to_list(length=None)
        user_missions = await self.user_mission_collection.find({'user_id': ObjectId(user_id)}).to_list(length=None)
        result = []

        total_finished = 0
        for mission in missions:
            mission_dto = UserMissionDto(id=str(mission['_id']),
                                         name=mission['name'],
                                         reward=mission['reward'],
                                         link=mission['link'],
                                         icon_type=mission['icon_type'],
                                         status=MissionStatus.Open.value)
            for user_mission in user_missions:
                if user_mission['mission_id'] == mission['_id']:
                    mission_dto.status = user_mission['status']
                    if mission_dto.status == MissionStatus.Completed.value:
                        total_finished += 1
                    continue

            result.append(mission_dto)

        dto = UserMissionDataDto(completed=total_finished, data=result)
        return dto

    async def navigate_async(self, mission_id: str, user_id: str):
        user = await self.user_collection.find_one({"_id": ObjectId(user_id)})
        if user is None:
            raise CustomException("User not found")

        mission = await self.mission_collection.find_one({'_id': ObjectId(mission_id)})

        user_mission_exist = await self.user_mission_collection.find_one({"mission_id": ObjectId(mission_id), "user_id": ObjectId(user_id)})
        if user_mission_exist is not None:
            return


        user_mission = UserMission(user_id=user['_id'],
                                   mission_id=mission['_id'],
                                   status=MissionStatus.Execution.value,
                                   complete_date=None)

        await self.user_mission_collection.insert_one(dict(user_mission))

    async def check_async(self, mission_id: str, user_id: str):
        user_mission = await self._get_user_mission_async(mission_id=mission_id, user_id=user_id)
        if user_mission is None:
            raise CustomException("Mission not found")
        time.sleep(7)

        mission = await self.mission_collection.find_one({'_id': ObjectId(user_mission['mission_id'])})
        if mission is None:
            raise CustomException("Mission not found")
        user = await self.user_collection.find_one({'_id': ObjectId(user_mission['user_id'])})
        if user is None:
            raise CustomException("User not found")
        if mission["icon_type"] == "Telegram":
            url_chat_id = f'https://api.telegram.org/bot{BOT_TOKEN}/getChat?chat_id={mission["chat_id"]}'
            response = requests.get(url_chat_id)
            data = response.json()

            if data['ok']:
                chat_id = data['result']['id']
                result = self._check_telegram(user_id=user["telegram_id"], channel_id=chat_id)
                if not result:
                    user_mission['status'] = MissionStatus.Open.value
                    await self.user_mission_collection.update_one(
                        {"_id": user_mission['_id']},
                        {"$set": user_mission}
                    )
                    raise CustomException(f"User not followed to group")

        user_mission['status'] = MissionStatus.Verified.value
        await self.user_mission_collection.update_one(
            {"_id": ObjectId(user_mission['_id'])},
            {"$set": user_mission}
        )

        user_inviter = await self.friends_collection.find_one({'referral_id': user['telegram_id']})
        if user_inviter is not None:
            user_inviter['missions_finished'] += 1
            await self.friends_collection.update_one(
                {"_id": ObjectId(user_inviter['_id'])},
                {"$set": user_inviter}
            )


    def _check_telegram(self, user_id: int, channel_id: int) -> bool:
        url = f"https://api.telegram.org/bot{BOT_TOKEN}/getChatMember"
        params = {
            'chat_id': channel_id,
            'user_id': user_id
        }

        response = requests.get(url, params=params)
        data = response.json()
        if data['ok'] is not True:
            return False

        res = data['result']
        if res['status'] == 'member':
            return True
        else:
            return False

    async def claim_reward(self, mission_id: str, user_id: str):
        user_mission = await self._get_user_mission_async(mission_id=mission_id, user_id=user_id)
        mission = await self.mission_collection.find_one({'_id': ObjectId(mission_id)})
        if mission is None:
            raise CustomException("Mission not found")

        user_mission['status'] = MissionStatus.Completed.value
        user_mission['complete_date'] = datetime.datetime.utcnow()
        await self.user_mission_collection.update_one(
            {"_id": user_mission['_id']},
            {"$set": user_mission}
        )

    async def _get_user_mission_async(self, mission_id: str, user_id: str):
        user_mission = await self.user_mission_collection.find_one({"mission_id": ObjectId(mission_id), "user_id": ObjectId(user_id)})
        if user_mission is None:
            raise CustomException("User mission not found")

        return user_mission

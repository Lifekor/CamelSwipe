import motor.motor_asyncio

from config.collections import Collections
from models.missions.mission import Mission

MONGO_DB_URL = 'mongodb+srv://sidsidorov20:0hQI8bKdsTRjai7U@cluster0.o8voyzu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DB_URL)
db = client.get_database("camel")#todo


async def init_db_async():
    boost = await db[Collections.BOOSTS].find().to_list(length=None)
    if len(boost) == 0:
        pass
    missions = await db[Collections.MISSIONS].find().to_list(length=None)
    # if len(missions) < 1:TODO
    #     invite_mission = Mission(name="Invite first friend",
    #                              reward=0.35,
    #                              link="",
    #                              icon_type="Friend",
    #                              chat_id="")
    #     youtube = Mission(name="YouTube",
    #                              reward=0.35,
    #                              link="https://youtube.com/@metacamelracing?si=I-2eJtulnQu_4dVA",
    #                              icon_type="YouTube",
    #                              chat_id="")
    #     x = Mission(name="X",
    #                         reward=1,
    #                         link="https://x.com/metacamelracing?s=21&t=52S_XrWfWdlBn-zp4nGhJQ",
    #                         icon_type="X",
    #                         chat_id="")
    #     telegram = Mission(name="Join our telegram",
    #                        reward=0.5,
    #                        link="https://t.me/metacamelrc",
    #                        icon_type="Telegram",
    #                        chat_id='-1002178681550')
    #     await db[Collections.MISSIONS].insert_one(dict(invite_mission))
    #     await db[Collections.MISSIONS].insert_one(dict(youtube))
    #     await db[Collections.MISSIONS].insert_one(dict(x))
    #     await db[Collections.MISSIONS].insert_one(dict(telegram))

    if len(missions) < 6:
        invite_mission = Mission(name="Invite first friend",
                                 reward=0.35,
                                 link="",
                                 icon_type="Friend",
                                 chat_id="")
        youtube = Mission(name="YouTube",
                                 reward=0.35,
                                 link="https://youtube.com/@metacamelracing?si=I-2eJtulnQu_4dVA",
                                 icon_type="YouTube",
                                 chat_id="")
        x = Mission(name="X",
                            reward=1,
                            link="https://x.com/metacamelracing?s=21&t=52S_XrWfWdlBn-zp4nGhJQ",
                            icon_type="X",
                            chat_id="")
        telegram = Mission(name="Join our telegram",
                           reward=0.5,
                           link="https://t.me/metacamelrc",
                           icon_type="Telegram",
                           chat_id='-1002178681550')
        await db[Collections.MISSIONS].insert_one(dict(invite_mission))
        await db[Collections.MISSIONS].insert_one(dict(youtube))
        await db[Collections.MISSIONS].insert_one(dict(x))
        await db[Collections.MISSIONS].insert_one(dict(telegram))

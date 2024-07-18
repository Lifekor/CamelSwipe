import motor.motor_asyncio


MONGO_DB_URL = 'mongodb+srv://sidsidorov20:0hQI8bKdsTRjai7U@cluster0.o8voyzu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DB_URL)
db = client.get_database("camel")  # todo

import motor.motor_asyncio

from config.collections import Collections
from models.boosts.boost import Boost
from models.boosts.boost_status import BoostType
from models.missions.mission import Mission

MONGO_DB_URL = 'mongodb+srv://sidsidorov20:0hQI8bKdsTRjai7U@cluster0.o8voyzu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DB_URL)
db = client.get_database("camel")  # todo


async def init_db_async():
    try:
        boost_collection = db[Collections.BOOSTS]
        missions_collection = db[Collections.MISSIONS]

        if not await boost_collection.count_documents({}):
            await create_boosts()

        if not await missions_collection.count_documents({}):
            await create_missions()
    except Exception as e:
        pass #todo log errer


async def create_boosts():
    boosts = [
        Boost(reward=5, boost_type=BoostType.Speed),
        Boost(reward=100, boost_type=BoostType.Stamina),
        Boost(reward=5, boost_type=BoostType.Regeneration),
        Boost(reward=5, boost_type=BoostType.PointBonus)
    ]
    boost_collection = db[Collections.BOOSTS]

    try:
        await boost_collection.insert_many([dict(boost) for boost in boosts])
    except Exception as e:
        print(f"An error occurred while creating boosts: {e}")


async def create_missions():
    missions = [
        Mission(name="Invite first friend", reward=0.35, link="", icon_type="Friend", chat_id=""),
        Mission(name="YouTube", reward=0.35, link="https://youtube.com/@metacamelracing?si=I-2eJtulnQu_4dVA",
                icon_type="YouTube", chat_id=""),
        Mission(name="X", reward=1, link="https://x.com/metacamelracing?s=21&t=52S_XrWfWdlBn-zp4nGhJQ", icon_type="X",
                chat_id=""),
        Mission(name="Join our telegram", reward=0.5, link="https://t.me/metacamelrc", icon_type="Telegram",
                chat_id='-1002178681550')
    ]
    missions_collection = db[Collections.MISSIONS]

    try:
        await missions_collection.insert_many([dict(mission) for mission in missions])
    except Exception as e:
        pass #todo log error
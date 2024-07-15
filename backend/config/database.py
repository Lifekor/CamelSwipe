import motor.motor_asyncio

from config.collections import Collections
from models.missions.mission import Mission

MONGO_DB_URL = 'mongodb+srv://sidsidorov:0hQI8bKdsTRjai7U@cluster0.o8voyzu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DB_URL)
db = client.get_database("camel")#todo


async def init_db_async():
    pass
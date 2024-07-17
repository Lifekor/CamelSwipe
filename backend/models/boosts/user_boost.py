from bson import ObjectId

from models.base_entity import BaseEntity


class UserBoost(BaseEntity):
    boost_id: ObjectId
    user_id: ObjectId

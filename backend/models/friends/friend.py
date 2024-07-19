import datetime

from pydantic import BaseModel


class Friend(BaseModel):
    inviter_id: int
    referral_username: str
    referral_id: int
    date_added: datetime.datetime
    coins: int

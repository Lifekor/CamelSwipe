from typing import List

from pydantic import BaseModel


class FriendsDataDto(BaseModel):
    referral_username: str
    inviter_id: int
    missions_finished: int


class FriendsDto(BaseModel):
    user_inviter: str
    data: List[FriendsDataDto]

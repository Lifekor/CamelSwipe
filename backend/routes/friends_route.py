from fastapi import APIRouter, Header, Depends

from services.friend_service import FriendsService

router = APIRouter()


@router.get('/')
async def get_async(x_user_id: str = Header(...), service: FriendsService = Depends()):
    return await service.get_async(x_user_id)


@router.post('/add-referral')
async def add_referral_async(inviter_id: int, referral_id: int, referral_username: str, service: FriendsService = Depends()):
    return await service.add_new_referral_async(inviter_id=inviter_id,
                                                referral_id=referral_id,
                                                referral_username=referral_username)

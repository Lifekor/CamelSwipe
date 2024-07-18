from fastapi import APIRouter, Header, Depends

from services.boost_service import BoostService
from services.friend_service import FriendsService

router = APIRouter()


@router.get('/')
async def get_async(x_user_id: str = Header(...), service: BoostService = Depends()):
    return await service.get_async(x_user_id)


@router.post('/buy-boost')
async def buy_boost_async(user_boost_id: str, x_user_id: str = Header(...), service: BoostService = Depends()):
    return await service.buy_boost_async(x_user_id, user_boost_id=user_boost_id)

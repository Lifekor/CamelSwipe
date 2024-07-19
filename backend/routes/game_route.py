from fastapi import APIRouter, Header, Depends

from services.boost_service import BoostService
from services.friend_service import FriendsService
from services.point_service import PointService

router = APIRouter()


@router.get('/')
async def get_async(user_id: int, service: PointService = Depends()):
    return await service.get_async(user_id=user_id)


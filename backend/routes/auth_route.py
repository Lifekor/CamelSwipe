from uuid import UUID

from fastapi import APIRouter, Depends, Header

from services.auth_service import AuthService
from services.point_service import PointService

router = APIRouter()


@router.post('/sign-in')
async def sign_in_async(user_id: int, username: str, service: AuthService = Depends()):
    return await service.sign_in_async(user_id=user_id, username=username)


@router.get('/get-data')
async def get_data(x_user_id: str = Header(...), service: AuthService = Depends()):
    return await service.get_user_coin(user_id=x_user_id)
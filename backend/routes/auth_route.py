from fastapi import APIRouter, Depends

from services.auth_service import AuthService

router = APIRouter()


@router.post('/sign-in')
async def sign_in_async(user_id: int, username: str, service: AuthService = Depends()):
    return await service.sign_in_async(user_id=user_id, username=username)

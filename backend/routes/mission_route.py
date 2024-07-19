from fastapi import APIRouter, Depends, Header

from services.mission_service import MissionService

router = APIRouter()


@router.get('/')
async def get_async(x_user_id: str = Header(...), service: MissionService = Depends()):
    return await service.get_async(user_id=x_user_id)


@router.post('/navigate')
async def navigate_user_async(mission_id: str, x_user_id: str = Header(...), service: MissionService = Depends()):
    return await service.navigate_async(mission_id=mission_id, user_id=x_user_id)


@router.post('/check')
async def check_async(mission_id: str, x_user_id: str = Header(...), service: MissionService = Depends()):
    return await service.check_async(user_id=x_user_id, mission_id=mission_id)


@router.post('/claim')
async def claim_async(mission_id: str, x_user_id: str = Header(...), service: MissionService = Depends()):
    return await service.claim_reward(user_id=x_user_id, mission_id=mission_id)
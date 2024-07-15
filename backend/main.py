import asyncio

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from config.database import init_db_async
from config.logger import LoggerSetup
from middleware.exception_middleware import ExceptionMiddleware
from routes import auth_route, mission_route, friends_route

app = FastAPI()
app.add_middleware(ExceptionMiddleware)

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = LoggerSetup.prepare()

@app.on_event("startup")
async def startup_event():
    await init_db_async()
    pass

app.include_router(auth_route.router, prefix="/auth", tags=["auth"])
app.include_router(mission_route.router, prefix="/mission", tags=["mission"])
app.include_router(friends_route.router, prefix="/friend", tags=["friend"])

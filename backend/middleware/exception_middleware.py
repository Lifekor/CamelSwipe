from starlette.middleware.base import BaseHTTPMiddleware, Request
from starlette.responses import JSONResponse

from config.logger import LoggerSetup
from exceptions.custom_exception import CustomException

app_logger = LoggerSetup.prepare()


class ExceptionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except CustomException as custom_exception:
            app_logger.error(f"CustomException: {custom_exception.args}")
            return JSONResponse(
                status_code=custom_exception.error_code,
                content=str(custom_exception.args[0])
            )
        except Exception as exc:
            app_logger.error(f"Exception: {exc}", exc_info=True)
            return JSONResponse(
                status_code=500,
                content=str("Oops something went wrong")
            )

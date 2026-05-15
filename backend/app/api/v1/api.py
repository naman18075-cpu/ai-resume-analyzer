from fastapi import APIRouter

from app.api.v1.endpoints.admin import router as admin_router
from app.api.v1.endpoints.analysis import router as analysis_router
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.dashboard import router as dashboard_router
from app.api.v1.endpoints.uploads import router as uploads_router


api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(uploads_router)
api_router.include_router(analysis_router)
api_router.include_router(dashboard_router)
api_router.include_router(admin_router)

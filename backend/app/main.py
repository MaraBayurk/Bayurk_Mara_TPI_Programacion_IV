from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import create_all_tables

from app.core.config import settings
from app.modules.auth.router import router as auth_router
from app.modules.usuarios.router import router as usuarios_router

app = FastAPI(
    title="Food Store API",
    description="API REST para la gestión de pedidos de Food Store",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.on_event("startup")
def on_startup():
    create_all_tables()

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(usuarios_router)

app.include_router(api_router)
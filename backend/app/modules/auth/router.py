
from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings
from app.core.deps import get_current_user
from app.modules.auth.schemas import TokenResponse
from app.modules.auth.service import AuthService
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UsuarioCreate, UsuarioRead


router = APIRouter(prefix="/auth", tags=["Autenticación"])
auth_service = AuthService()


@router.post(
    "/register",
    response_model=UsuarioRead,
    status_code=status.HTTP_201_CREATED
)
def register(datos: UsuarioCreate):
    try:
        return auth_service.registrar(datos)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error)
        )


@router.post("/token", response_model=TokenResponse)
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends()
):
    try:
        resultado = auth_service.iniciar_sesion(
            form_data.username,
            form_data.password
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

    if not resultado:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos"
        )

    usuario, token = resultado

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

    return TokenResponse(message="Inicio de sesión exitoso")


@router.post("/logout", response_model=TokenResponse)
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE
    )

    return TokenResponse(message="Sesión cerrada correctamente")

@router.get("/me", response_model=UsuarioRead)
def get_me(usuario: Usuario = Depends(get_current_user)):
    return usuario

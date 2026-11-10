
from collections.abc import Callable

from fastapi import Cookie, Depends, HTTPException, status

from app.core.security import decode_access_token
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


def get_current_user(
    access_token: str | None = Cookie(default=None)
) -> Usuario:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No autenticado o sesión inválida"
    )

    if not access_token:
        raise credentials_exception

    payload = decode_access_token(access_token)

    if not payload or not payload.get("sub"):
        raise credentials_exception

    try:
        usuario_id = int(payload["sub"])
    except (TypeError, ValueError):
        raise credentials_exception

    with UsuarioUnitOfWork() as uow:
        usuario = uow.usuarios.get_by_id(usuario_id)

        if not usuario:
            raise credentials_exception

        return usuario


def get_current_active_user(
    usuario: Usuario = Depends(get_current_user)
) -> Usuario:
    if usuario.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cuenta de usuario desactivada"
        )

    return usuario


def require_role(roles: list[str]) -> Callable:
    def role_checker(
        usuario: Usuario = Depends(get_current_active_user)
    ) -> Usuario:
        if usuario.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tenés permisos para realizar esta acción"
            )

        return usuario

    return role_checker

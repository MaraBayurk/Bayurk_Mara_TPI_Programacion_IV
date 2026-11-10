
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

        if not usuario or usuario.disabled:
            raise credentials_exception

        return usuario


def get_current_admin_user(
    usuario: Usuario = Depends(get_current_user)
) -> Usuario:
    if usuario.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tenés permisos para realizar esta acción"
        )

    return usuario

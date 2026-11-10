
from fastapi import APIRouter, Depends, status

from app.core.deps import require_role
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UsuarioRead
from app.modules.usuarios.service import UsuarioService


router = APIRouter(
    prefix="/admin/usuarios",
    tags=["Administración de usuarios"]
)

usuario_service = UsuarioService()


@router.get(
    "",
    response_model=list[UsuarioRead]
)
def listar_usuarios(
    admin: Usuario = Depends(require_role(["admin"]))
):
    return usuario_service.listar()


@router.post(
    "/{usuario_id}/activar",
    response_model=UsuarioRead,
    status_code=status.HTTP_200_OK
)
def activar_usuario(
    usuario_id: int,
    admin: Usuario = Depends(require_role(["admin"]))
):
    return usuario_service.activar(usuario_id)


@router.post(
    "/{usuario_id}/desactivar",
    response_model=UsuarioRead,
    status_code=status.HTTP_200_OK
)
def desactivar_usuario(
    usuario_id: int,
    admin: Usuario = Depends(require_role(["admin"]))
):
    return usuario_service.desactivar(
        usuario_id,
        admin.id
    )

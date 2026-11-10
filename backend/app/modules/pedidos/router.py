from fastapi import APIRouter, Depends, Query, status

from app.core.deps import get_current_active_user, require_role
from app.modules.usuarios.models import Usuario
from app.modules.pedidos.schemas import (
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    CambioEstado,
    ResumenPedidos,
)
from app.modules.pedidos.service import PedidoService


router = APIRouter(
    prefix="/pedidos",
    tags=["Pedidos"],
)


def get_pedido_service() -> PedidoService:
    return PedidoService()


@router.post(
    "",
    response_model=PedidoRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_pedido(
    datos: PedidoCreate,
    usuario: Usuario = Depends(get_current_active_user),
    service: PedidoService = Depends(get_pedido_service),
):
    return service.crear(datos, usuario.id)


@router.get("", response_model=PedidosPaginados)
def listar_pedidos(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1),
    estado: str | None = None,
    usuario: Usuario = Depends(get_current_active_user),
    service: PedidoService = Depends(get_pedido_service),
):
    return service.listar(
        usuario_id=usuario.id,
        es_admin=usuario.role == "admin",
        skip=skip,
        limit=limit,
        estado=estado,
    )


# Debe declararse antes de /{pedido_id}
@router.get("/resumen", response_model=ResumenPedidos)
def obtener_resumen(
    admin: Usuario = Depends(require_role(["admin"])),
    service: PedidoService = Depends(get_pedido_service),
):
    return service.resumen()


@router.get("/{pedido_id}", response_model=PedidoRead)
def obtener_pedido(
    pedido_id: int,
    usuario: Usuario = Depends(get_current_active_user),
    service: PedidoService = Depends(get_pedido_service),
):
    return service.obtener(
        pedido_id=pedido_id,
        usuario_id=usuario.id,
        es_admin=usuario.role == "admin",
    )


@router.patch("/{pedido_id}/estado", response_model=PedidoRead)
def cambiar_estado_pedido(
    pedido_id: int,
    datos: CambioEstado,
    admin: Usuario = Depends(require_role(["admin"])),
    service: PedidoService = Depends(get_pedido_service),
):
    return service.cambiar_estado(
        pedido_id=pedido_id,
        nuevo_estado=datos.estado,
    )


@router.patch("/{pedido_id}/cancelar", response_model=PedidoRead)
def cancelar_pedido(
    pedido_id: int,
    usuario: Usuario = Depends(get_current_active_user),
    service: PedidoService = Depends(get_pedido_service),
):
    return service.cancelar_por_usuario(
        pedido_id=pedido_id,
        usuario_id=usuario.id,
    )
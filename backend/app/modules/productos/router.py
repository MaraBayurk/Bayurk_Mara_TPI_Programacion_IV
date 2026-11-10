from fastapi import APIRouter, Depends, Query, Response, status

from app.core.deps import require_role
from app.modules.usuarios.models import Usuario
from app.modules.productos.schemas import (
    ProductoCreate,
    ProductoRead,
    ProductoUpdate,
    ProductoStockUpdate,
    ProductosPaginados,
)
from app.modules.productos.service import ProductoService


router = APIRouter(
    prefix="/productos",
    tags=["Productos"],
)


def get_producto_service() -> ProductoService:
    return ProductoService()


@router.get("", response_model=ProductosPaginados)
def listar_productos(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1),
    search: str | None = None,
    categoria_id: int | None = Query(default=None, ge=1),
    disponible: bool | None = None,
    service: ProductoService = Depends(get_producto_service),
):
    return service.listar(
        skip=skip,
        limit=limit,
        search=search,
        categoria_id=categoria_id,
        disponible=disponible,
    )


@router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto(
    producto_id: int,
    service: ProductoService = Depends(get_producto_service),
):
    return service.obtener(producto_id)


@router.post(
    "",
    response_model=ProductoRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_producto(
    datos: ProductoCreate,
    service: ProductoService = Depends(get_producto_service),
    admin: Usuario = Depends(require_role(["admin"])),
):
    return service.crear(datos)


@router.put("/{producto_id}", response_model=ProductoRead)
def actualizar_producto(
    producto_id: int,
    datos: ProductoUpdate,
    service: ProductoService = Depends(get_producto_service),
    admin: Usuario = Depends(require_role(["admin"])),
):
    return service.actualizar(producto_id, datos)


@router.patch("/{producto_id}/stock", response_model=ProductoRead)
def actualizar_stock(
    producto_id: int,
    datos: ProductoStockUpdate,
    service: ProductoService = Depends(get_producto_service),
    admin: Usuario = Depends(require_role(["admin"])),
):
    return service.actualizar_stock(producto_id, datos)


@router.delete(
    "/{producto_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_producto(
    producto_id: int,
    service: ProductoService = Depends(get_producto_service),
    admin: Usuario = Depends(require_role(["admin"])),
):
    service.eliminar(producto_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
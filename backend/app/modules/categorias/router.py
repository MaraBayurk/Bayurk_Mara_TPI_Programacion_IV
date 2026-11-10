from fastapi import APIRouter, Depends, Response, status

from app.core.deps import require_role
from app.modules.usuarios.models import Usuario
from app.modules.categorias.schemas import (
    CategoriaCreate,
    CategoriaRead,
    CategoriaUpdate,
)
from app.modules.categorias.service import CategoriaService


router = APIRouter(
    prefix="/categorias",
    tags=["Categorías"],
)


def get_categoria_service() -> CategoriaService:
    return CategoriaService()


@router.get("", response_model=list[CategoriaRead])
def listar_categorias(
    service: CategoriaService = Depends(get_categoria_service),
):
    return service.listar()


@router.get("/{categoria_id}", response_model=CategoriaRead)
def obtener_categoria(
    categoria_id: int,
    service: CategoriaService = Depends(get_categoria_service),
):
    return service.obtener(categoria_id)


@router.post(
    "",
    response_model=CategoriaRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_categoria(
    datos: CategoriaCreate,
    service: CategoriaService = Depends(get_categoria_service),
    admin: Usuario = Depends(require_role(["admin"])),
):
    return service.crear(datos)


@router.put("/{categoria_id}", response_model=CategoriaRead)
def actualizar_categoria(
    categoria_id: int,
    datos: CategoriaUpdate,
    service: CategoriaService = Depends(get_categoria_service),
    admin: Usuario = Depends(require_role(["admin"])),
):
    return service.actualizar(categoria_id, datos)


@router.delete(
    "/{categoria_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_categoria(
    categoria_id: int,
    service: CategoriaService = Depends(get_categoria_service),
    admin: Usuario = Depends(require_role(["admin"])),
):
    service.eliminar(categoria_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
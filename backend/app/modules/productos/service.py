from fastapi import HTTPException, status

from app.modules.productos.models import Producto
from app.modules.productos.schemas import (
    ProductoCreate,
    ProductoUpdate,
    ProductoStockUpdate,
    ProductoRead,
    ProductosPaginados,
)
from app.modules.productos.unit_of_work import ProductoUnitOfWork


class ProductoService:

    def __init__(self, uow: ProductoUnitOfWork | None = None):
        self.uow = uow or ProductoUnitOfWork()

    def listar(
        self,
        skip: int = 0,
        limit: int = 10,
        search: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
    ) -> ProductosPaginados:

        with self.uow as uow:
            productos, total = uow.productos.buscar(
                skip=skip,
                limit=limit,
                search=search,
                categoria_id=categoria_id,
                disponible=disponible,
            )

            items = [
                ProductoRead.model_validate(producto)
                for producto in productos
            ]

            return ProductosPaginados(total=total, items=items)

    def obtener(self, producto_id: int) -> ProductoRead:
        with self.uow as uow:
            producto = uow.productos.get_by_id(producto_id)

            if not producto or not producto.activo:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Producto no encontrado",
                )

            return ProductoRead.model_validate(producto)

    def crear(self, datos: ProductoCreate) -> ProductoRead:
        with self.uow as uow:
            categoria = uow.categorias.get_by_id(datos.categoria_id)

            if not categoria or not categoria.activo:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Categoría no encontrada",
                )

            producto = Producto(**datos.model_dump())
            producto = uow.productos.add(producto)

            return ProductoRead.model_validate(producto)

    def actualizar(
        self,
        producto_id: int,
        datos: ProductoUpdate,
    ) -> ProductoRead:

        with self.uow as uow:
            producto = uow.productos.get_by_id(producto_id)

            if not producto or not producto.activo:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Producto no encontrado",
                )

            cambios = datos.model_dump(exclude_unset=True)

            if "categoria_id" in cambios:
                if cambios["categoria_id"] is None:
                    raise HTTPException(
                        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                        detail="La categoría no puede ser nula",
                    )

                categoria = uow.categorias.get_by_id(cambios["categoria_id"])

                if not categoria or not categoria.activo:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Categoría no encontrada",
                    )

            for campo, valor in cambios.items():
                setattr(producto, campo, valor)

            return ProductoRead.model_validate(producto)

    def actualizar_stock(
        self,
        producto_id: int,
        datos: ProductoStockUpdate,
    ) -> ProductoRead:

        with self.uow as uow:
            producto = uow.productos.get_by_id(producto_id)

            if not producto or not producto.activo:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Producto no encontrado",
                )

            producto.stock = datos.stock
            producto.disponible = datos.disponible

            return ProductoRead.model_validate(producto)

    def eliminar(self, producto_id: int) -> None:
        with self.uow as uow:
            producto = uow.productos.get_by_id(producto_id)

            if not producto or not producto.activo:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Producto no encontrado",
                )

            producto.activo = False
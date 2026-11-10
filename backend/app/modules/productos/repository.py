from sqlmodel import select, func

from app.core.base_repository import BaseRepository
from app.modules.productos.models import Producto


class ProductoRepository(BaseRepository[Producto]):

    def __init__(self, session):
        super().__init__(session, Producto)

    def buscar(
        self,
        skip: int = 0,
        limit: int = 10,
        search: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
    ) -> tuple[list[Producto], int]:

        filtros = [Producto.activo.is_(True)]

        if search:
            filtros.append(Producto.nombre.ilike(f"%{search}%"))

        if categoria_id is not None:
            filtros.append(Producto.categoria_id == categoria_id)

        if disponible is not None:
            filtros.append(Producto.disponible == disponible)

        consulta = (
            select(Producto)
            .where(*filtros)
            .offset(skip)
            .limit(limit)
        )

        consulta_total = (
            select(func.count())
            .select_from(Producto)
            .where(*filtros)
        )

        productos = list(self.session.exec(consulta).all())
        total = self.session.exec(consulta_total).one()

        return productos, total
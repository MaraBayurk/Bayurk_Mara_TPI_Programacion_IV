from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.productos.models import Producto


class ProductoRepository(BaseRepository[Producto]):

    def __init__(self, session: Session):
        super().__init__(session, Producto)

    def search(
        self,
        nombre: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None
    ) -> list[Producto]:

        statement = select(Producto).where(
            Producto.activo == True
        )

        if nombre:
            statement = statement.where(
                Producto.nombre.ilike(f"%{nombre}%")
            )

        if categoria_id is not None:
            statement = statement.where(
                Producto.categoria_id == categoria_id
            )

        if disponible is not None:
            statement = statement.where(
                Producto.disponible == disponible
            )

        return list(self.session.exec(statement).all())
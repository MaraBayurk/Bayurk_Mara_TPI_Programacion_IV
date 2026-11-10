
from sqlmodel import select

from app.core.base_repository import BaseRepository
from app.modules.categorias.models import Categoria


class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session):
        super().__init__(session, Categoria)

    def get_by_nombre(self, nombre: str) -> Categoria | None:
        statement = select(Categoria).where(
            Categoria.nombre == nombre
        )
        return self.session.exec(statement).first()

    def get_all_activas(self) -> list[Categoria]:
        statement = select(Categoria).where(
            Categoria.activo.is_(True)
        )
        return list(self.session.exec(statement).all())

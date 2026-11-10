from sqlalchemy import func
from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import Pedido


class PedidoRepository(BaseRepository[Pedido]):

    def __init__(self, session: Session):
        super().__init__(session, Pedido)

    def list_by_usuario(
        self,
        usuario_id: int,
        skip: int = 0,
        limit: int = 20,
        estado: str | None = None
    ) -> list[Pedido]:

        statement = select(Pedido).where(
            Pedido.usuario_id == usuario_id
        )

        if estado:
            statement = statement.where(
                Pedido.estado == estado
            )

        statement = statement.offset(skip).limit(limit)

        return list(self.session.exec(statement).all())

    def count_by_estado(self, estado: str) -> int:
        statement = select(func.count()).select_from(Pedido).where(
            Pedido.estado == estado
        )

        return self.session.exec(statement).one()
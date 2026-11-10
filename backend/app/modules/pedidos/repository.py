from sqlmodel import select, func
from datetime import date, datetime, time

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import Pedido


class PedidoRepository(BaseRepository[Pedido]):

    def __init__(self, session):
        super().__init__(session, Pedido)

    def list_by_usuario(
        self,
        usuario_id: int,
        skip: int = 0,
        limit: int = 20,
        estado: str | None = None,
    ) -> tuple[list[Pedido], int]:

        filtros = [Pedido.usuario_id == usuario_id]

        if estado:
            filtros.append(Pedido.estado == estado)

        consulta = (
            select(Pedido)
            .where(*filtros)
            .offset(skip)
            .limit(limit)
            .order_by(Pedido.created_at.desc())
        )

        consulta_total = (
            select(func.count())
            .select_from(Pedido)
            .where(*filtros)
        )

        pedidos = list(self.session.exec(consulta).all())
        total = self.session.exec(consulta_total).one()

        return pedidos, total

    def list_all(
        self,
        skip: int = 0,
        limit: int = 20,
        estado: str | None = None,
    ) -> tuple[list[Pedido], int]:

        filtros = []

        if estado:
            filtros.append(Pedido.estado == estado)

        consulta = (
            select(Pedido)
            .where(*filtros)
            .offset(skip)
            .limit(limit)
            .order_by(Pedido.created_at.desc())
        )

        consulta_total = (
            select(func.count())
            .select_from(Pedido)
            .where(*filtros)
        )

        pedidos = list(self.session.exec(consulta).all())
        total = self.session.exec(consulta_total).one()

        return pedidos, total

    def count_by_estado(self, estado: str) -> int:
        consulta = (
            select(func.count())
            .select_from(Pedido)
            .where(Pedido.estado == estado)
        )

        return self.session.exec(consulta).one()
    
    def count_pedidos_hoy(self) -> int:
        inicio = datetime.combine(date.today(), time.min)
        fin = datetime.combine(date.today(), time.max)

        consulta = (
            select(func.count())
            .select_from(Pedido)
            .where(
                Pedido.created_at >= inicio,
                Pedido.created_at <= fin,
            )
        )

        return self.session.exec(consulta).one()


    def ingresos_entregados(self) -> float:
        consulta = (
            select(func.coalesce(func.sum(Pedido.total), 0))
            .where(Pedido.estado == "ENTREGADO")
        )

        return float(self.session.exec(consulta).one())
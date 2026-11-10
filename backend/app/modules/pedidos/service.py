from fastapi import HTTPException, status
from datetime import datetime

from app.modules.pedidos.models import Pedido, DetallePedido
from app.modules.pedidos.schemas import PedidoCreate, PedidoRead, ResumenPedidos
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork

class PedidoService:

    def __init__(self, uow: PedidoUnitOfWork | None = None):
        self.uow = uow or PedidoUnitOfWork()

    def crear(self, datos: PedidoCreate, usuario_id: int) -> PedidoRead:

        with self.uow as uow:

            # RN-01: no permitir productos repetidos
            productos_ids = [
                item.producto_id for item in datos.items
            ]

            if len(productos_ids) != len(set(productos_ids)):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No se puede repetir un producto en el pedido",
                )

            # Crear pedido inicialmente
            pedido = Pedido(
                usuario_id=usuario_id,
                estado="PENDIENTE",
                forma_pago=datos.forma_pago,
                direccion_entrega=datos.direccion_entrega,
                notas=datos.notas,
                total=0,
                items=[],
)

            pedido = uow.pedidos.add(pedido)

            total = 0

            # Procesar cada producto
            for item in datos.items:

                producto = uow.productos.get_by_id(item.producto_id)

                if not producto or not producto.activo:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Producto {item.producto_id} no encontrado",
                    )

                if not producto.disponible:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"El producto {producto.nombre} no está disponible",
                    )

                if producto.stock < item.cantidad:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Stock insuficiente para {producto.nombre}",
                    )

                # Descontar stock
                producto.stock -= item.cantidad

                # Calcular subtotal
                subtotal = producto.precio_base * item.cantidad

                # Crear detalle con copia del nombre y precio
                detalle = DetallePedido(
                    pedido_id=pedido.id,
                    producto_id=producto.id,
                    cantidad=item.cantidad,
                    nombre_producto=producto.nombre,
                    precio_unitario=producto.precio_base,
                    subtotal=subtotal,
                )

                uow.session.add(detalle)
                pedido.items.append(detalle)

                total += subtotal

            # Calcular total del pedido
            pedido.total = total

            return PedidoRead.model_validate(pedido)
        
        
    def listar(
        self,
        usuario_id: int,
        es_admin: bool,
        skip: int = 0,
        limit: int = 20,
        estado: str | None = None,
    ):
        with self.uow as uow:

            if es_admin:
                pedidos, total = uow.pedidos.list_all(
                    skip=skip,
                    limit=limit,
                    estado=estado,
                )
            else:
                pedidos, total = uow.pedidos.list_by_usuario(
                    usuario_id=usuario_id,
                    skip=skip,
                    limit=limit,
                    estado=estado,
                )

            items = [
                PedidoRead.model_validate(pedido)
                for pedido in pedidos
            ]

            return {
                "total": total,
                "items": items,
            }
    
    
    def obtener(self, pedido_id: int, usuario_id: int, es_admin: bool):
        with self.uow as uow:

            pedido = uow.pedidos.get_by_id(pedido_id)

            if not pedido:
                raise HTTPException(
                    status_code=404,
                    detail="Pedido no encontrado",
                )

            if not es_admin and pedido.usuario_id != usuario_id:
                raise HTTPException(
                    status_code=403,
                    detail="No tenés permiso para consultar este pedido",
                )

            return PedidoRead.model_validate(pedido)
    
    
    TRANSICIONES = {
    "PENDIENTE": ["EN_PREPARACION", "CANCELADO"],
    "EN_PREPARACION": ["ENTREGADO", "CANCELADO"],
    "ENTREGADO": [],
    "CANCELADO": [],
}


    def cambiar_estado(self, pedido_id: int, nuevo_estado: str):
        with self.uow as uow:

            pedido = uow.pedidos.get_by_id(pedido_id)

            if not pedido:
                raise HTTPException(
                    status_code=404,
                    detail="Pedido no encontrado",
                )

            estados_permitidos = self.TRANSICIONES[pedido.estado]

            if nuevo_estado not in estados_permitidos:
                raise HTTPException(
                    status_code=400,
                    detail="Transición de estado inválida",
                )

            if nuevo_estado == "CANCELADO":
                self._restituir_stock(uow, pedido)

            pedido.estado = nuevo_estado
            pedido.updated_at = datetime.utcnow()

            return PedidoRead.model_validate(pedido)
    
    def _restituir_stock(self, uow, pedido):
        for detalle in pedido.items:
            producto = uow.productos.get_by_id(detalle.producto_id)

            if producto:
                producto.stock += detalle.cantidad
                
    def cancelar_por_usuario(self, pedido_id: int, usuario_id: int):
        with self.uow as uow:

            pedido = uow.pedidos.get_by_id(pedido_id)

            if not pedido:
                raise HTTPException(
                    status_code=404,
                    detail="Pedido no encontrado",
                )

            if pedido.usuario_id != usuario_id:
                raise HTTPException(
                    status_code=403,
                    detail="No tenés permiso para cancelar este pedido",
                )

            if pedido.estado != "PENDIENTE":
                raise HTTPException(
                    status_code=400,
                    detail="Solo se pueden cancelar pedidos pendientes",
                )

            self._restituir_stock(uow, pedido)

            pedido.estado = "CANCELADO"
            pedido.updated_at = datetime.utcnow()

            return PedidoRead.model_validate(pedido)

    
    def resumen(self) -> ResumenPedidos:
        with self.uow as uow:
            return ResumenPedidos(
                pendientes=uow.pedidos.count_by_estado("PENDIENTE"),
                en_preparacion=uow.pedidos.count_by_estado("EN_PREPARACION"),
                entregados=uow.pedidos.count_by_estado("ENTREGADO"),
                cancelados=uow.pedidos.count_by_estado("CANCELADO"),
                pedidos_hoy=uow.pedidos.count_pedidos_hoy(),
                ingresos_entregados=uow.pedidos.ingresos_entregados(),
            )
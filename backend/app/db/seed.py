
from sqlmodel import select

from app.core.database import create_all_tables
from app.core.security import get_password_hash
from app.modules.usuarios.models import Usuario
from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork
from app.modules.productos.unit_of_work import ProductoUnitOfWork


def seed():
    create_all_tables()

    # Administrador
    with UsuarioUnitOfWork() as uow:
        admin = uow.usuarios.get_by_username("admin")

        if not admin:
            uow.usuarios.add(
                Usuario(
                    username="admin",
                    full_name="Administrador",
                    email="admin@foodstore.com",
                    hashed_password=get_password_hash("Admin1234!"),
                    role="admin"
                )
            )

    # Categorías
    categorias_iniciales = [
        {"nombre": "Hamburguesas", "descripcion": "Hamburguesas y combos"},
        {"nombre": "Pizzas", "descripcion": "Pizzas artesanales"},
        {"nombre": "Bebidas", "descripcion": "Bebidas frías y calientes"}
    ]

    with CategoriaUnitOfWork() as uow:
        for datos in categorias_iniciales:
            categoria = uow.categorias.get_by_nombre(datos["nombre"])

            if not categoria:
                uow.categorias.add(Categoria(**datos))

    # Obtener IDs de categorías
    with CategoriaUnitOfWork() as uow:
        categorias = {
            categoria.nombre: categoria.id
            for categoria in uow.categorias.get_all()
        }

    # Productos
    productos_iniciales = [
        ("Hamburguesa clásica", "Hamburguesa tradicional", 5000, "https://placehold.co/400x300", 20, "Hamburguesas"),
        ("Hamburguesa doble", "Doble carne y queso", 7000, "https://placehold.co/400x300", 15, "Hamburguesas"),
        ("Hamburguesa completa", "Carne, queso, huevo y vegetales", 6500, "https://placehold.co/400x300", 12, "Hamburguesas"),
        ("Pizza muzzarella", "Pizza clásica de muzzarella", 8000, "https://placehold.co/400x300", 10, "Pizzas"),
        ("Pizza napolitana", "Pizza con tomate y ajo", 9000, "https://placehold.co/400x300", 10, "Pizzas"),
        ("Pizza especial", "Pizza con jamón y morrones", 10000, "https://placehold.co/400x300", 8, "Pizzas"),
        ("Agua mineral", "Botella de agua mineral", 1500, "https://placehold.co/400x300", 30, "Bebidas"),
        ("Gaseosa cola", "Gaseosa de 500 ml", 2000, "https://placehold.co/400x300", 25, "Bebidas")
    ]

    with ProductoUnitOfWork() as uow:
        for nombre, descripcion, precio, imagen, stock, categoria_nombre in productos_iniciales:
            existente = uow.session.exec(
                select(Producto).where(Producto.nombre == nombre)
            ).first()

            if not existente:
                uow.productos.add(
                    Producto(
                        categoria_id=categorias[categoria_nombre],
                        nombre=nombre,
                        descripcion=descripcion,
                        precio_base=precio,
                        imagen_url=imagen,
                        stock=stock
                    )
                )

    print("Seed ejecutado correctamente.")


if __name__ == "__main__":
    seed()

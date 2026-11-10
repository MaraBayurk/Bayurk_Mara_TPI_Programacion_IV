from sqlmodel import SQLModel, Field, Relationship


class Producto(SQLModel, table=True):
    __tablename__ = "productos"

    id: int | None = Field(default=None, primary_key=True)
    categoria_id: int = Field(foreign_key="categorias.id", index=True)
    nombre: str
    descripcion: str | None = None
    precio_base: float = Field(ge=0)
    imagen_url: str
    stock: int = Field(default=0, ge=0)
    disponible: bool = Field(default=True)
    activo: bool = Field(default=True)

    categoria: "Categoria" = Relationship(back_populates="productos")
    detalles: list["DetallePedido"] = Relationship(back_populates="producto")
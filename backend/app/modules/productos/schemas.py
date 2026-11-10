from sqlmodel import SQLModel, Field
from app.modules.categorias.schemas import CategoriaRead


class ProductoCreate(SQLModel):
    nombre: str
    descripcion: str | None = None
    precio_base: float = Field(ge=0)
    imagen_url: str
    stock: int = Field(default=0, ge=0)
    disponible: bool = True
    categoria_id: int


class ProductoUpdate(SQLModel):
    nombre: str | None = None
    descripcion: str | None = None
    precio_base: float | None = Field(default=None, ge=0)
    imagen_url: str | None = None
    stock: int | None = Field(default=None, ge=0)
    disponible: bool | None = None
    categoria_id: int | None = None


class ProductoStockUpdate(SQLModel):
    stock: int = Field(ge=0)
    disponible: bool


class ProductoRead(SQLModel):
    id: int
    nombre: str
    descripcion: str | None
    precio_base: float
    imagen_url: str
    stock: int
    disponible: bool
    categoria_id: int
    activo: bool
    categoria: CategoriaRead


class ProductosPaginados(SQLModel):
    total: int
    items: list[ProductoRead]
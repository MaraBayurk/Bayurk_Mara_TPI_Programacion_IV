from pydantic import model_validator
from sqlmodel import SQLModel, Field

from app.modules.categorias.schemas import CategoriaRead


class ProductoCreate(SQLModel):
    nombre: str = Field(min_length=1)
    descripcion: str | None = None
    precio_base: float = Field(ge=0)
    imagen_url: str = Field(min_length=1)
    stock: int = Field(default=0, ge=0)
    disponible: bool = True
    categoria_id: int


class ProductoUpdate(SQLModel):
    nombre: str | None = Field(default=None, min_length=1)
    descripcion: str | None = None
    precio_base: float | None = Field(default=None, ge=0)
    imagen_url: str | None = Field(default=None, min_length=1)
    stock: int | None = Field(default=None, ge=0)
    disponible: bool | None = None
    categoria_id: int | None = None

    @model_validator(mode="before")
    @classmethod
    def rechazar_nulos_en_campos_obligatorios(cls, datos):
        if isinstance(datos, dict):
            campos_obligatorios = (
                "nombre",
                "precio_base",
                "imagen_url",
                "stock",
                "disponible",
                "categoria_id",
            )
            for campo in campos_obligatorios:
                if campo in datos and datos[campo] is None:
                    raise ValueError(
                        f"El campo '{campo}' no puede ser nulo"
                    )
        return datos


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
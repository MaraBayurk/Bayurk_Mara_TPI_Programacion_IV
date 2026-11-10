from fastapi import HTTPException, status

from app.core.security import get_password_hash, verify_password
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UsuarioCreate, UsuarioRead
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class UsuarioService:
    def __init__(self, uow: UsuarioUnitOfWork | None = None):
        self.uow = uow or UsuarioUnitOfWork()

    def registrar(self, datos: UsuarioCreate) -> UsuarioRead:
        with self.uow as uow:
            if uow.usuarios.get_by_username(datos.username):
                raise ValueError("El nombre de usuario ya está registrado")

            if uow.usuarios.get_by_email(datos.email):
                raise ValueError("El email ya está registrado")

            usuario = Usuario(
                username=datos.username,
                full_name=datos.full_name,
                email=datos.email,
                hashed_password=get_password_hash(datos.password)
            )

            usuario = uow.usuarios.add(usuario)
            return UsuarioRead.model_validate(usuario)

    def autenticar(self, username: str, password: str) -> Usuario | None:
        with self.uow as uow:
            usuario = uow.usuarios.get_by_username(username)

            if not usuario:
                return None

            if usuario.disabled:
                raise ValueError("La cuenta se encuentra deshabilitada")

            if not verify_password(password, usuario.hashed_password):
                return None

            # Se conserva el modelo Usuario porque AuthService necesita
            # su ID para generar el token.
            return usuario

    def listar(self) -> list[UsuarioRead]:
        with self.uow as uow:
            usuarios = uow.usuarios.get_all()
            return [
                UsuarioRead.model_validate(usuario)
                for usuario in usuarios
            ]

    def activar(self, usuario_id: int) -> UsuarioRead:
        with self.uow as uow:
            usuario = uow.usuarios.get_by_id(usuario_id)

            if not usuario:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Usuario no encontrado"
                )

            usuario.disabled = False
            return UsuarioRead.model_validate(usuario)

    def desactivar(
        self,
        usuario_id: int,
        admin_id: int
    ) -> UsuarioRead:
        with self.uow as uow:
            if usuario_id == admin_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No podés desactivar tu propia cuenta"
                )

            usuario = uow.usuarios.get_by_id(usuario_id)

            if not usuario:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Usuario no encontrado"
                )

            usuario.disabled = True
            return UsuarioRead.model_validate(usuario)
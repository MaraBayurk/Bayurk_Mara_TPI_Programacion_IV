
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UsuarioCreate
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork
from app.core.security import get_password_hash, verify_password


class UsuarioService:
    def __init__(self, uow: UsuarioUnitOfWork | None = None):
        self.uow = uow or UsuarioUnitOfWork()

    def registrar(self, datos: UsuarioCreate) -> Usuario:
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

            return uow.usuarios.add(usuario)

    def autenticar(self, username: str, password: str) -> Usuario | None:
        with self.uow as uow:
            usuario = uow.usuarios.get_by_username(username)

            if not usuario:
                return None

            if usuario.disabled:
                raise ValueError("La cuenta se encuentra deshabilitada")

            if not verify_password(password, usuario.hashed_password):
                return None

            return usuario

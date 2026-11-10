
from datetime import timedelta

from app.core.config import settings
from app.core.security import create_access_token
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UsuarioCreate
from app.modules.usuarios.service import UsuarioService


class AuthService:
    def __init__(self):
        self.usuarios = UsuarioService()

    def registrar(self, datos: UsuarioCreate) -> Usuario:
        return self.usuarios.registrar(datos)

    def iniciar_sesion(
        self,
        username: str,
        password: str
    ) -> tuple[Usuario, str] | None:
        usuario = self.usuarios.autenticar(username, password)

        if not usuario:
            return None

        token = create_access_token(
            subject=str(usuario.id),
            expires_delta=timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )
        )

        return usuario, token

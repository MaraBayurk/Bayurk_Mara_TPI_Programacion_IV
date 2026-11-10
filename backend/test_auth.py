
from getpass import getpass

from app.core.security import verify_password
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

username = input("Username registrado: ")
password = getpass("Contraseña registrada: ")

with UsuarioUnitOfWork() as uow:
    usuario = uow.usuarios.get_by_username(username)

    print("Usuario encontrado:", usuario is not None)

    if usuario:
        print("Usuario deshabilitado:", usuario.disabled)
        print(
            "Contraseña correcta:",
            verify_password(password, usuario.hashed_password)
        )

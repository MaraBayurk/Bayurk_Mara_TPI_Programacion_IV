from sqlalchemy import text
from app.core.database import engine

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version()"))
        print("Conexión exitosa:")
        print(result.scalar())

except Exception as error:
    print(f"Error de conexión: {error}")
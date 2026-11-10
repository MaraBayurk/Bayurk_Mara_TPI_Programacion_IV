from sqlmodel import SQLModel, Session, create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


engine = create_engine(
    settings.DATABASE_URL,
    echo=False
)


session_factory = sessionmaker(
    bind=engine,
    class_=Session,
    expire_on_commit=False
)


def create_all_tables() -> None:
    SQLModel.metadata.create_all(engine)
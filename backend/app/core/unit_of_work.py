from app.core.database import session_factory


class UnitOfWork:

    def __enter__(self):
        self.session = session_factory()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        try:
            if exc_type is not None:
                self.session.rollback()
            else:
                self.session.commit()
        finally:
            self.session.close()

        return False
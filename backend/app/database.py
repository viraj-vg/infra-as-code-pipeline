import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_PATH = os.getenv("DATABASE_PATH", "/data/clouddeploy.db")
if DATABASE_PATH == ":memory:":
    DATABASE_URL = "sqlite://"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    os.makedirs(os.path.dirname(DATABASE_PATH) or ".", exist_ok=True)
    engine = create_engine(
        f"sqlite:///{DATABASE_PATH}",
        connect_args={"check_same_thread": False},
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

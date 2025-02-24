from flask_sqlalchemy import SQLAlchemy
import os

import app

app.app.config["SQLALCHEMY_DATABASE_URI"] = (
    f'mysql+pymysql://{os.getenv("DB_USER")}:{os.getenv("DB_PASSWORD")}@{os.getenv("DB_HOST")}/{os.getenv("DB_NAME")}'
)
app.app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app.app)

with app.app.app_context():
    print("Creating database")
    # db.drop_all()
    db.create_all()

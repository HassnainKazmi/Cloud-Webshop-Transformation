from flask_sqlalchemy import SQLAlchemy
import database

class ProductModel(database.db.Model):
    id = database.db.Column(database.db.Integer, primary_key=True)
    name = database.db.Column(database.db.String(80), unique=True, nullable=False)
    quantity = database.db.Column(database.db.Integer)

    def __repr__(self):
        return f'id: {self.id}\tName: {self.name}'

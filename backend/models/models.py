from flask_sqlalchemy import SQLAlchemy
import database


class Category(database.db.Model):
    __tablename__ = 'category'
    id = database.db.Column(database.db.Integer, primary_key=True)
    name = database.db.Column(database.db.String(80), unique=True, nullable=False)
    products = database.db.relationship('Product', backref='category')

class Product(database.db.Model):
    __tablename__ = 'product'
    id = database.db.Column(database.db.Integer, primary_key=True)
    name = database.db.Column(database.db.String(80), unique=True, nullable=False)
    quantity = database.db.Column(database.db.Integer)
    category_id = database.db.Column(database.db.Integer, database.db.ForeignKey('category.id'))

    def __repr__(self):
        return f'id: {self.id}\tName: {self.name}'

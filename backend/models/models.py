from flask_sqlalchemy import SQLAlchemy
import enum
import database

class StockLevel(enum.Enum):
    LOW = 'LOW'
    MEDIUM = 'MEDIUM'
    HIGH = 'HIGH'
    OUT_OF_STOCK = 'OUT OF STOCK'

class User(database.db.Model):
    __tablename__ = 'user'
    id = database.db.Column(database.db.Integer, primary_key=True)
    first_name = database.db.Column(database.db.String(30), nullable=False)
    last_name = database.db.Column(database.db.String(30), nullable=False)
    email = database.db.Column(database.db.String(70), nullable=False)
    address = database.db.Column(database.db.String(200), nullable=False)

class Category(database.db.Model):
    __tablename__ = 'category'
    id = database.db.Column(database.db.Integer, primary_key=True)
    name = database.db.Column(database.db.String(80), unique=True, nullable=False)
    products = database.db.relationship('Product', backref='category')

class Product(database.db.Model):
    __tablename__ = 'product'
    id = database.db.Column(database.db.Integer, primary_key=True)
    name = database.db.Column(database.db.String(80), unique=False, nullable=False)
    quantity = database.db.Column(database.db.Integer)
    category_id = database.db.Column(database.db.Integer, database.db.ForeignKey('category.id'), nullable=False)

    def __repr__(self):
        return f'id: {self.id}\tName: {self.name}'

class Inventory(database.db.Model):
    __tablename__ = 'inventory'
    id = database.db.Column(database.db.Integer, primary_key=True)
    product_id = database.db.Column(database.db.Integer, database.db.ForeignKey('product.id'), nullable=False)
    stock_quantity = database.db.Column(database.db.Integer, nullable=False)
    stock_level = database.db.Column(database.db.Enum(StockLevel), nullable=False)

from sqlalchemy.sql import func
import database
from utils.enums import StockLevel, OrderStatus


class User(database.db.Model):
    __tablename__ = "user"
    id = database.db.Column(database.db.Integer, primary_key=True)
    first_name = database.db.Column(database.db.String(30), nullable=False)
    last_name = database.db.Column(database.db.String(30), nullable=False)
    email = database.db.Column(database.db.String(70), nullable=False)
    address = database.db.Column(database.db.String(200), nullable=True)
    is_admin = database.db.Column(database.db.Boolean, default=False)
    orders = database.db.relationship("Order", backref="user_info")


class Category(database.db.Model):
    __tablename__ = "category"
    id = database.db.Column(database.db.Integer, primary_key=True)
    name = database.db.Column(database.db.String(80), unique=True, nullable=False)
    products = database.db.relationship("Product", backref="category")


class Product(database.db.Model):
    __tablename__ = "product"
    id = database.db.Column(database.db.Integer, primary_key=True)
    name = database.db.Column(database.db.String(80), unique=False, nullable=False)
    price = database.db.Column(database.db.Float, nullable=False)
    category_id = database.db.Column(
        database.db.Integer, database.db.ForeignKey("category.id"), nullable=False
    )
    order_item = database.db.relationship("OrderItem", backref="product_info")
    inventory = database.db.relationship("Inventory", backref="product", uselist=False)

    def __repr__(self):
        return f"id: {self.id}\tName: {self.name}"


class Inventory(database.db.Model):
    __tablename__ = "inventory"
    id = database.db.Column(database.db.Integer, primary_key=True)
    product_id = database.db.Column(
        database.db.Integer,
        database.db.ForeignKey("product.id"),
        nullable=False,
        unique=True,
    )
    stock_quantity = database.db.Column(database.db.Integer, nullable=False)
    stock_level = database.db.Column(database.db.Enum(StockLevel), nullable=False)


class Order(database.db.Model):
    __tablename__ = "order"
    id = database.db.Column(database.db.Integer, primary_key=True)
    order_date = database.db.Column(
        database.db.DateTime(timezone=True), nullable=False, default=func.now()
    )
    total_price = database.db.Column(database.db.Float, nullable=False)
    items_count = database.db.Column(database.db.Integer, nullable=False)
    status = database.db.Column(
        database.db.Enum(OrderStatus), nullable=False, default=OrderStatus.IN_PROCESS
    )
    user_id = database.db.Column(
        database.db.Integer, database.db.ForeignKey("user.id"), nullable=False
    )
    order_items = database.db.relationship("OrderItem", backref="order_info")


class OrderItem(database.db.Model):
    __tablename__ = "order_item"
    id = database.db.Column(database.db.Integer, primary_key=True)
    order_id = database.db.Column(
        database.db.Integer, database.db.ForeignKey("order.id"), nullable=False
    )
    product_id = database.db.Column(
        database.db.Integer, database.db.ForeignKey("product.id"), nullable=False
    )

class Payment(database.db.Model):
    __tablename__ = 'payment'
    id = database.db.Column(database.db.Integer, primary_key=True)
    user_id = database.db.Column(database.db.Integer, database.db.ForeignKey('user.id'), nullable=False)
    order_id = database.db.Column(database.db.Integer, database.db.ForeignKey('order.id'), nullable=False)
    amount = database.db.Column(database.db.Float, nullable=False)
    status = database.db.Column(database.db.Enum('PENDING', 'COMPLETED', 'FAILED'), nullable=False, default='PENDING')
    payment_date = database.db.Column(database.db.DateTime, nullable=False, default=func.now())


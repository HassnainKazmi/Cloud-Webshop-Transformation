from flask_restful import Resource, marshal_with, abort

import database
from models.models import Order as OrderModel, User, Product, OrderItem

from utils.fields import order_fields
from utils.order_request_arguments import post_order_arguments


class Order(Resource):
    @marshal_with(order_fields)
    def get(self, id):
        """Get order with the id."""
        orders = OrderModel.query.filter_by(id=id).first()
        if not orders:
            abort(404, message="No order found with the provided id")
        return orders, 200


class OrderOperations(Resource):
    def post(self):
        """Create order with the provided json."""
        args = post_order_arguments.parse_args()
        user_id = args.get("user_id")
        user = User.query.filter_by(id=user_id).first()
        if not user:
            abort(404, message=f"User with the id ${user_id} not found!")
        product_ids = args.get("product_ids")
        print(product_ids)
        products = Product.query.filter(Product.id.in_(product_ids)).all()
        if len(product_ids) != len(products):
            abort(404, message="One or more products not found, due to bad ids")
        print(products)
        order = OrderModel(
            total_price=sum(int(product.price) for product in products),
            items_count=len(products),
            user_info=user,
        )
        database.db.session.add(order)
        database.db.session.commit()
        print(order)
        order_items_list = []
        for product in products:
            order_items_list.append(OrderItem(order_id=order.id, product_id=product.id))
        database.db.session.add_all(order_items_list)
        database.db.session.commit()
        return 201

from flask_restful import Resource, marshal_with, abort

import database
from models.models import Order as OrderModel, User, Product, OrderItem, Inventory

from utils.fields import order_fields
from utils.order_request_arguments import post_order_arguments, patch_order_arguments
from utils.utils import calculate_stock_level, send_mail
from utils.enums import OrderStatus


class Order(Resource):
    @marshal_with(order_fields)
    def get(self, id):
        """Get order with the id."""
        order = OrderModel.query.filter_by(id=id).first()
        if not order:
            abort(404, message="No order found with the provided id")
        order_dict = order.__dict__
        order_dict["products"] = [o.product_info for o in order.order_items]
        return order_dict, 200

    @marshal_with(order_fields)
    def patch(self, id):
        """Updates order's status"""
        args = patch_order_arguments.parse_args()
        order = OrderModel.query.filter_by(id=id).first_or_404()
        allowed_status = OrderStatus.list()
        new_status = args["status"]
        if new_status not in allowed_status:
            abort(400, message="Passed value of new status not allowed!")
        # if order.status != OrderStatus.IN_PROCESS:
        #     abort(400, message='')
        user_info = order.user_info
        order.status = new_status
        database.db.session.commit()
        if order.status == OrderStatus.DELIVERED:
            if send_mail(
                subject="Order Delivered",
                message="Your order has been delivered",
                recipients=[user_info.email],
            ):
                print("email sent!")
        order_dict = order.__dict__
        order_dict["products"] = [o.product_info for o in order.order_items]
        return order_dict, 200


class OrderOperations(Resource):
    @marshal_with(order_fields)
    def get(self):
        """Get all orders."""
        orders = OrderModel.query.all()
        if not orders:
            abort(404, message="No order found with the provided id")
        order_list = []
        for order in list(orders):
            order_dict = order.__dict__
            order_dict["products"] = [o.product_info for o in order.order_items]
            order_list.append(order_dict)
        return order_list, 200

    def post(self):
        """Create order with the provided json."""
        args = post_order_arguments.parse_args()
        user_id = args.get("user_id")
        user = User.query.filter_by(id=user_id).first()
        if not user:
            abort(404, message=f"User with the id ${user_id} not found!")
        order_products = args.get("products")
        product_ids = [product["product_id"] for product in order_products]
        products = Product.query.filter(Product.id.in_(product_ids)).all()
        if len(order_products) != len(products):
            abort(404, message="One or more products not found, due to bad ids")
        products_dict = {
            product.id: product.inventory.stock_quantity for product in products
        }
        for order_product_info in order_products:
            required_product_id = order_product_info.get("product_id")
            required_product_quantity = order_product_info.get("quantity")
            available_quantity = products_dict.get(required_product_id, 0)
            if available_quantity < required_product_quantity:
                abort(
                    400,
                    message=f"Product with id {required_product_id} does not have sufficient quantity",
                )
        order = OrderModel(
            total_price=sum(int(product.price) for product in products),
            items_count=len(order_products),
            user_info=user,
        )
        database.db.session.add(order)
        database.db.session.commit()
        order_items_list = []
        for product in products:
            order_items_list.append(OrderItem(order_id=order.id, product_id=product.id))
        database.db.session.add_all(order_items_list)
        database.db.session.commit()
        updated_inventory_data = []
        for inventory_item in (
            Inventory.query.join(Product).filter(Product.id.in_(product_ids)).all()
        ):
            order_product = next(
                (
                    product
                    for product in order_products
                    if product["product_id"] == inventory_item.product_id
                ),
                None,
            )
            inventory_item.stock_quantity = (
                inventory_item.stock_quantity - order_product["quantity"]
            )
            inventory_item.stock_level = calculate_stock_level(
                inventory_item.stock_quantity
            )
            updated_inventory_data.append(inventory_item.__dict__)
        database.db.session.bulk_update_mappings(Inventory, updated_inventory_data)
        database.db.session.commit()
        return 201

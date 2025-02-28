from flask_restful import Resource, marshal_with, abort
from sqlalchemy import and_
from datetime import datetime

import database
from models.models import Order as OrderModel, User, Product, OrderItem, Inventory

from utils.fields import order_fields
from utils.order_request_arguments import post_order_arguments, patch_order_arguments
from utils.utils import calculate_stock_level, send_mail_gmail
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
        if order.status == OrderStatus.DELIVERED:
            abort(
                400,
                message="Can not update the status of order that has been completed!",
            )
        user_info = order.user_info
        order.status = new_status
        print("new_status", new_status)
        database.db.session.commit()
        if (
            order.status == OrderStatus.CONFIRMED
            or order.status == OrderStatus.DELIVERED
        ):
            send_mail_gmail(
                subject="Order Status Updated",
                recipients=[user_info.email],
                template_name="order_status.html",
                order_id=order.id,
                status=order.status,
            )
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

    @marshal_with(order_fields)
    def post(self):
        """Create order with the provided json."""
        args = post_order_arguments.parse_args()
        user_id = args.get("user_id")
        user = User.query.filter_by(id=user_id).first()
        if not user:
            print("User not found! Using default from database.")
            user = User.query.filter(User.is_admin).first()
        order_products = args.get("products")
        product_ids = [product["product_id"] for product in order_products]
        products = Product.query.filter(
            and_(
                Product.id.in_(product_ids),
                Product.inventory.has(Inventory.stock_level > 0),
            )
        ).all()
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
        total_price = self._calculate_total_price(products, order_products)
        order = OrderModel(
            total_price=total_price,
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
        low_quantity_ids = []
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
            if inventory_item.stock_quantity < 10:
                low_quantity_ids.append(inventory_item.id)
            updated_inventory_data.append(inventory_item.__dict__)
        if len(low_quantity_ids) > 0:
            send_mail_gmail(
                subject="Low Stock Alert",
                recipients=[user.email],
                template_name="low_stock.html",
                ids=low_quantity_ids,
            )
        database.db.session.bulk_update_mappings(Inventory, updated_inventory_data)
        database.db.session.commit()
        send_mail_gmail(
            subject="Order Confirmation",
            recipients=[user.email],
            template_name="order_confirm.html",
            name=user.first_name,
            date=datetime.today().strftime("%m/%d/%Y"),
            receipt_details=[
                {"description": product.name, "amount": product.price}
                for product in products
            ],
            total_price=total_price,
        )
        order_dict = order.__dict__
        order_dict["products"] = [o.product_info for o in order.order_items]
        return order_dict, 201

    def _calculate_total_price(self, products: list, order_products: list) -> int:
        total_price = 0
        for order in order_products:
            product = next(
                product for product in products if product.id == order["product_id"]
            )
            total_price = product.price * order["quantity"]
        return total_price

from flask_restful import fields

product_fields = {
    "id": fields.Integer,
    "name": fields.String,
    "quantity": fields.Integer,
    "price": fields.Float,
    "category_name": fields.String,
}

category_fields = {"id": fields.Integer, "name": fields.String}

nested_order_fields = {
    "id": fields.Integer,
    "name": fields.String,
    "price": fields.Float,
}

order_fields = {
    "id": fields.Integer,
    "order_date": fields.DateTime,
    "total_price": fields.Float,
    "status": fields.String,
    "products": fields.Nested(nested=nested_order_fields),
}

user_fields = {
    "first_name": fields.String,
    "last_name": fields.String,
    "email": fields.String,
    "address": fields.String,
}

stripe_get_publishable_key = {"public_key": fields.String}

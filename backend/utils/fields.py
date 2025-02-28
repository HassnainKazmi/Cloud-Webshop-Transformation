from flask_restful import fields

category_fields = {"id": fields.Integer, "name": fields.String}

product_fields = {
    "id": fields.Integer,
    "name": fields.String,
    "description": fields.String,
    "quantity": fields.Integer,
    "price": fields.Float,
    "category": fields.Nested(nested=category_fields),
}

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

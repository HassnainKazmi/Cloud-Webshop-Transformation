from flask_restful import fields

product_fields = {
    "id": fields.Integer,
    "name": fields.String,
    "quantity": fields.Integer,
    "price": fields.Float,
    "category_name": fields.String,
}

category_fields = {"id": fields.Integer, "name": fields.String}

order_fields = {
    "id": fields.Integer,
    "order_date": fields.DateTime,
    "total_price": fields.Float,
    "status": fields.String,
}

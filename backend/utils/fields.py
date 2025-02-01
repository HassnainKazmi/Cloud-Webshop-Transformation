from flask_restful import fields

product_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'quantity': fields.Integer
}

category_fields = {
    'id': fields.Integer,
    'name': fields.String
}

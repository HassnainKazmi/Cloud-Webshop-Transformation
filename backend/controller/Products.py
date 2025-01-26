from flask_restful import Resource, marshal_with, reqparse, abort

import database
from models.Product import ProductModel
from utils.fields import product_fields

product_args = reqparse.RequestParser()
product_args.add_argument('name', type=str, required=True, help='Name is required')
product_args.add_argument('quantity', type=int, required=True, help='Quantity is required')

class Products(Resource):
    @marshal_with(product_fields)
    def get(self):
        products = ProductModel.query.all()
        return products

    @marshal_with(product_fields)
    def post(self):
        args = product_args.parse_args()
        new_product = ProductModel(name=args['name'], quantity=args['quantity'])
        database.db.session.add(new_product)
        database.db.session.commit()
        all_products = ProductModel.query.all()
        return all_products, 201


class ProductOperations(Resource):
    @marshal_with(product_fields)
    def patch(self, id):
        args = product_args.parse_args()
        product_to_update = ProductModel.query.filter_by(id=id).first()
        if not product_to_update:
            abort(404, message='Product not found!')
        product_to_update.name = args['name']
        product_to_update.quantity = args['quantity']
        database.db.session.commit()
        return product_to_update

    @marshal_with(product_fields)
    def delete(self, id):
        product_to_delete = ProductModel.query.filter_by(id=id).first()
        if not product_to_delete:
            abort(404, message='Product not found!')
        database.db.session.delete(product_to_delete)
        database.db.session.commit()
        all_products = ProductModel.query.all()
        return all_products, 200

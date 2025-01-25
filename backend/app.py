from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api, reqparse, fields, marshal_with, abort

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
api = Api(app)

product_args = reqparse.RequestParser()
product_args.add_argument('name', type=str, required=True, help='Name is required')
product_args.add_argument('quantity', type=int, required=True, help='Quantity is required')

class ProductModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    quantity = db.Column(db.Integer)

    def __repr__(self):
        return f'id: {self.id}\tName: {self.name}'

product_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'quantity': fields.Integer
}

class Products(Resource):
    @marshal_with(product_fields)
    def get(self):
        products = ProductModel.query.all()
        return products

    @marshal_with(product_fields)
    def post(self):
        args = product_args.parse_args()
        print(args)
        new_product = ProductModel(name=args['name'], quantity=args['quantity'])
        db.session.add(new_product)
        db.session.commit()
        all_products = ProductModel.query.all()
        return all_products, 201


api.add_resource(Products, '/api/products/')

@app.route('/')
def test_endpoint():
    return {'message': 'Hello world!'}


if __name__ == '__main__':
    app.run(debug=True)

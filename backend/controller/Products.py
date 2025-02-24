from flask_restful import Resource, marshal_with, abort
from flask import request

import database
from models.models import Product, Category, Inventory

from utils.fields import product_fields
from utils.product_request_arguments import post_product_args, patch_product_args
from utils.utils import calculate_stock_level


class Products(Resource):
    @marshal_with(product_fields)
    def get(self):
        return self._get_products_list()

    @marshal_with(product_fields)
    def post(self):
        args = post_product_args.parse_args()
        image = request.files["image"]
        print(image)
        if image:
            print(image)
        category = Category().query.filter_by(id=args["category_id"]).first()
        new_product = Product(
            name=args["name"],
            price=args["price"],
            category=category,
        )
        database.db.session.add(new_product)
        database.db.session.commit()
        # add the product to inventory along with its quantity
        inventory_item = Inventory(
            product_id=new_product.id,
            stock_quantity=args["quantity"],
            stock_level=calculate_stock_level(args["quantity"]),
        )
        database.db.session.add(inventory_item)
        database.db.session.commit()
        return self._get_products_list(), 201

    def _get_products_list(self):
        products = Product.query.all()
        products_list = []
        for product in products:
            product_dict = product.__dict__
            product_dict["category_name"] = product.category.name
            products_list.append(product_dict)
        return products_list


class ProductOperations(Resource):
    @marshal_with(product_fields)
    def get(self, id):
        product = Product.query.filter_by(id=id).first()
        if not product:
            abort(404, message="Product not found")
        setattr(product, "category", product.category)
        return product, 200

    @marshal_with(product_fields)
    def patch(self, id):
        args = patch_product_args.parse_args(strict=True)
        product_to_update = Product.query.filter_by(id=id).first()
        if not product_to_update:
            abort(404, message="Product not found!")
        product_to_update.name = args["name"]
        product_to_update.quantity = args["quantity"]
        database.db.session.commit()
        product_to_update_dict = product_to_update.__dict__
        product_to_update_dict["category_name"] = product_to_update.category.name
        return product_to_update_dict

    @marshal_with(product_fields)
    def delete(self, id):
        product_to_delete = Product.query.filter_by(id=id).first()
        if not product_to_delete:
            abort(404, message="Product not found!")
        database.db.session.delete(product_to_delete)
        database.db.session.commit()
        all_products = Product.query.all()
        return all_products, 200

from flask_restful import Resource, marshal_with
import database
from models.models import Category

from utils.fields import category_fields
from utils.category_request_arguments import post_category_args

class Categories(Resource):
    @marshal_with(category_fields)
    def get(self):
        categories = Category.query.all()
        return categories

    @marshal_with(category_fields)
    def post(self):
        args = post_category_args.parse_args(strict=True)
        new_category = Category(name=args['name'])
        database.db.session.add(new_category)
        database.db.session.commit()
        return new_category, 201

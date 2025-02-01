from flask_restful import Resource, marshal_with
from utils.fields import category_fields
from models.models import Category

class Categories(Resource):
    @marshal_with(category_fields)
    def get(self):
        categories = Category.query.all()
        return categories

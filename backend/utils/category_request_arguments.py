from flask_restful import reqparse

# POST category
post_category_args = reqparse.RequestParser()
post_category_args.add_argument('name', type=str, required=True, help='Name is required')

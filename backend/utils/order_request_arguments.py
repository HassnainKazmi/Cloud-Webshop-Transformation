from flask_restful import reqparse, inputs

# POST order arguments
post_order_arguments = reqparse.RequestParser()
post_order_arguments.add_argument("user_id", type=int, required=True)
post_order_arguments.add_argument(
    "product_ids", type=int, action="append", location="json"
)  # for a comma separated list

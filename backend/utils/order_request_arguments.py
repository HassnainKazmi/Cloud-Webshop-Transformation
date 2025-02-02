from flask_restful import reqparse, inputs

# POST order arguments
post_order_arguments = reqparse.RequestParser()
post_order_arguments.add_argument("user_id", type=int, required=True)
post_order_arguments.add_argument(
    "products",
    type=list,
    location="json",
    required=True,
    help="Products field is required and must be a list.",
)

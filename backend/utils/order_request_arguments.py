from flask_restful import reqparse, inputs

# POST order arguments
post_order_arguments = reqparse.RequestParser()
post_order_arguments.add_argument("user_id", type=int, required=False)
post_order_arguments.add_argument(
    "products",
    type=list,
    location="json",
    required=True,
    help="Products field is required and must be a list.",
)

# PATCH order arguments
patch_order_arguments = reqparse.RequestParser()
patch_order_arguments.add_argument("status", type=str, required=True)

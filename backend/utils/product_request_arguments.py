from flask_restful import reqparse

# POST product args
post_product_args = reqparse.RequestParser()
post_product_args.add_argument("name", type=str, required=True, help="Name is required")
post_product_args.add_argument(
    "quantity", type=int, required=True, help="Quantity is required"
)
post_product_args.add_argument(
    "price", type=float, required=True, help="Price is required"
)
post_product_args.add_argument("category_id", type=int, required=True)

# PATCH product args
patch_product_args = post_product_args.copy()
patch_product_args.remove_argument("category_id")
patch_product_args.replace_argument("name", required=False, type=str)
patch_product_args.replace_argument("quantity", required=False, type=int)

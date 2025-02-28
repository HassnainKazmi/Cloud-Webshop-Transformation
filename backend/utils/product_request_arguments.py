from flask_restful import reqparse
from werkzeug.datastructures import FileStorage

# POST product args
post_product_args = reqparse.RequestParser()
post_product_args.add_argument(
    "name", type=str, required=True, help="Name is required", location="form"
)
post_product_args.add_argument(
    "description",
    type=str,
    required=True,
    help="Description is required",
    location="form",
)
post_product_args.add_argument(
    "quantity", type=int, required=True, help="Quantity is required", location="form"
)
post_product_args.add_argument(
    "price", type=float, required=True, help="Price is required", location="form"
)
post_product_args.add_argument("category_id", type=int, required=True, location="form")
post_product_args.add_argument(
    "image", type=FileStorage, location="files", required=False
)

# PATCH product args
patch_product_args = post_product_args.copy()
patch_product_args.remove_argument("category_id")
patch_product_args.replace_argument("name", required=False, type=str)
patch_product_args.replace_argument("quantity", required=False, type=int)

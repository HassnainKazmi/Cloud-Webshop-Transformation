from flask_restful import reqparse

post_stripe_arguments = reqparse.RequestParser()
post_stripe_arguments.add_argument(
    "line_items",
    type=list,
    location="json",
    required=True,
    help="Line items are required.",
)

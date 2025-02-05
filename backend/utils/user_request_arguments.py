from flask_restful import reqparse

post_user_arguments = reqparse.RequestParser()
post_user_arguments.add_argument("first_name", type=str, required=True)
post_user_arguments.add_argument("last_name", type=str, required=True)
post_user_arguments.add_argument("email", type=str, required=True)
post_user_arguments.add_argument("address", type=str, required=False)
post_user_arguments.add_argument("admin", type=str, location="headers", required=True)

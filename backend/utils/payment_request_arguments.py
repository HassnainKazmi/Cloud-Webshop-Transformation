from flask_restful import reqparse

post_payment_arguments = reqparse.RequestParser()
post_payment_arguments.add_argument('user_id', type=int, required=True, help="User ID is required")
post_payment_arguments.add_argument('order_id', type=int, required=True, help="Order ID is required")
post_payment_arguments.add_argument('amount', type=float, required=True, help="Amount is required")
post_payment_arguments.add_argument('payment_method', type=str, required=True, help="Payment method is required")

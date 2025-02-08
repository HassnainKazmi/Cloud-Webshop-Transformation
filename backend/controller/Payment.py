from flask_restful import Resource, marshal_with, abort

import database
from models.models import Payment as PaymentModel, User as UserModel, Order as OrderModel
from utils.payment_request_arguments import post_payment_arguments
from utils.fields import payment_fields


class Payment(Resource):
    @marshal_with(payment_fields)
    def post(self):
        """Creates a payment for a given user and order"""
        args = post_payment_arguments.parse_args(strict=True)
        user_id = args.get("user_id")
        order_id = args.get("order_id")
        amount = args.get("amount")
        payment_method = args.get("payment_method")

        user = UserModel.query.get(user_id)
        if not user:
            abort(404, message=f"User with ID {user_id} not found!")

        order = OrderModel.query.get(order_id)
        if not order:
            abort(404, message=f"Order with ID {order_id} not found!")

        if order.total_price != amount:
            abort(400, message=f"The amount {amount} does not match the total price of the order!")

        payment = PaymentModel(
            user_id=user_id,
            order_id=order_id,
            amount=amount,
            status="PENDING",
        )
        database.db.session.add(payment)
        database.db.session.commit()
        database.db.session.refresh(payment)

        # Here you can integrate the payment gateway (e.g., Stripe, PayPal) for actual payment processing
        # For now, let's just simulate the payment as 'COMPLETED' after it's added to the database
        payment.status = "COMPLETED"

        database.db.session.commit()

        return payment.__dict__, 201

    def get(self, payment_id):
        """Get payment details by payment ID"""
        payment = PaymentModel.query.get(payment_id)
        if not payment:
            abort(404, message=f"Payment with ID {payment_id} not found!")

        return payment.__dict__


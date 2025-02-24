from flask import jsonify
from flask_restful import Resource
from requests import request
import stripe


class SessionStatus(Resource):
    def get(self):
        session = stripe.checkout.Session.retrieve(request.args.get("session_id"))
        return jsonify(
            status=session.status, customer_email=session.customer_details.email
        )

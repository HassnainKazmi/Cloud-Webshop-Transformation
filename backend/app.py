import os
from flask import Flask, jsonify
from flask_restful import Api
from flask_cors import CORS
import stripe
from flask_mail import Mail
from dotenv import load_dotenv

from utils.stripe_request_arguments import post_stripe_arguments

app_env = os.getenv("APP_ENV", "development")

if app_env == "development":
    load_dotenv(".env.dev")
else:
    load_dotenv()

stripe_keys = {
    "secret_key": os.getenv("STRIPE_SECRET_KEY"),
    "publishable_key": os.getenv("STRIPE_PUBLISHABLE_KEY"),
}

stripe.api_key = stripe_keys["secret_key"]

app = Flask(__name__)
app.debug = True
api = Api(app)

CORS(app)

app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER")
app.config["MAIL_PORT"] = os.getenv("MAIL_PORT")
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
app.config["MAIL_USE_TLS"] = False
app.config["MAIL_USE_SSL"] = True

mail = Mail(app)

import controller.Products  # noqa: E402
import controller.Category  # noqa: E402
import controller.Order  # noqa: E402
import controller.User  # noqa: E402
import controller.Payment  # noqa: E402

# Products endpoints
api.add_resource(controller.Products.Products, "/api/products/")
api.add_resource(controller.Products.ProductOperations, "/api/product/<int:id>")

# Categories endpoints
api.add_resource(controller.Category.Categories, "/api/categories/")

# Order endpoints
api.add_resource(controller.Order.Order, "/api/orders/<int:id>")
api.add_resource(controller.Order.OrderOperations, "/api/order/")

# User endpoints
api.add_resource(controller.User.User, "/api/user/")

api.add_resource(controller.Payment.SessionStatus, "/api/stripe/status")


@app.route("/")
def root():
    return {"message": "Flask API v1"}


@app.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    args = post_stripe_arguments.parse_args()
    line_items = args.get("line_items")
    session = stripe.checkout.Session.create(
        # line_items=[
        #     {
        #         "price_data": {
        #             "currency": "eur",
        #             "product_data": {
        #                 "name": "T-shirt",
        #             },
        #             "unit_amount": 2000,
        #         },
        #         "quantity": 1,
        #     }
        # ],
        line_items=line_items,
        mode="payment",
        ui_mode="embedded",
        return_url=os.getenv("PAYMENT_RESULT_URL")
        + "?session_id={CHECKOUT_SESSION_ID}",
    )

    return jsonify(clientSecret=session.client_secret)


if __name__ == "__main__":
    app.run(debug=True)

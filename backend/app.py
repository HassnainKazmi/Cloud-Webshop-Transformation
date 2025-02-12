import os
from flask import Flask
from flask_restful import Api
from flask_mail import Mail
from dotenv import load_dotenv

app_env = os.getenv("APP_ENV", "development")

if app_env == "development":
    load_dotenv(".env.dev")
else:
    load_dotenv()

app = Flask(__name__)
api = Api(app)

app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER")
app.config["MAIL_PORT"] = os.getenv("MAIL_PORT")
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
app.config["MAIL_USE_TLS"] = False
app.config["MAIL_USE_SSL"] = True

mail = Mail(app)

import controller.Products
import controller.Category  # noqa: E402
import controller.Order
import controller.User

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


@app.route("/")
def test_endpoint():
    return {"message": "Flask API v1"}


if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask
from flask_restful import Api

app = Flask(__name__)
api = Api(app)

import controller.Products
import controller.Category
import controller.Order

# Products endpoints
api.add_resource(controller.Products.Products, "/api/products/", endpoint="products")
api.add_resource(controller.Products.ProductOperations, "/api/product/<int:id>")

# Categories endpoints
api.add_resource(
    controller.Category.Categories, "/api/categories/", endpoint="categories"
)

# Order endpoints
api.add_resource(controller.Order.Order, "/api/orders/<int:id>", endpoint="order")
api.add_resource(controller.Order.OrderOperations, "/api/order/")


@app.route("/")
def test_endpoint():
    return {"message": "Flask API v1"}


if __name__ == "__main__":
    app.run(debug=True)

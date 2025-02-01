from flask import Flask
from flask_restful import Api

app = Flask(__name__)
api = Api(app)

import controller.Products
import controller.Category

# Products endpoints
api.add_resource(controller.Products.Products, '/api/products/', endpoint='products')
api.add_resource(controller.Products.ProductOperations, '/api/product/<int:id>')

# Categories endpoints
api.add_resource(controller.Category.Categories, '/api/categories/', endpoint='categories')

@app.route('/')
def test_endpoint():
    return {'message': 'Flask API v1'}


if __name__ == '__main__':
    app.run(debug=True)

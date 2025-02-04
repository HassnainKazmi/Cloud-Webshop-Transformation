import React from "react";
import { useParams } from "react-router-dom";
import products from "../data/products.json";
import Navbar from "../components/Navbar"; // For consistent navigation bar
import { useCart } from "../context/CartContext";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useCart(); // Access cart actions

  const product = products.find((product) => product.id === parseInt(id || "", 10));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Navbar /> {/* Ensure Cart Icon is visible */}
        <h1 className="text-xl font-bold mb-4">Product Not Found</h1>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 ease-in-out"
        >
          Back to Catalog
        </button>
      </div>
    );
  }
  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      },
    });
  };

  return (
    <div className="container mx-auto my-10 px-4 py-6">
      <Navbar /> {/* Ensure Cart Icon is visible */}
      {/* Back to Catalog Button */}
      <div className="mb-4 mt-10">
        <button
          onClick={() => window.history.back()}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg shadow-md hover:bg-gray-300 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          ← Back to Catalog
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-6 transition-all duration-300 ease-in-out">
        {/* Product Image */}
        <div className="flex justify-center items-center">
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg border border-gray-200 transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">{product.name}</h1>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">{product.description}</p>
            <p className="text-3xl font-semibold text-blue-600 mb-6">${product.price.toFixed(2)}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            {/* Add to Cart Button */}
            <button
              className="flex-1 px-6 py-3 bg-green-500 text-white text-lg font-medium rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            {/* Buy Now Button */}
            <button
              className="flex-1 px-6 py-3 bg-orange-500 text-white text-lg font-medium rounded-lg shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={() => alert("Buy Now functionality to be implemented")}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

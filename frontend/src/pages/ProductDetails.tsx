import React from "react";
import { useParams } from "react-router-dom";
import products from "../data/products.json";
import BackButton from "../components/BackButton";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const product = products.find(
    (product) => product.id === parseInt(id || "", 10)
  );

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-4">Product Not Found</h1>
        <BackButton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <BackButton />
      <div className="flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow-lg p-6">
        {/* Product Image */}
        <div className="md:w-1/2 flex justify-center items-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-h-[400px] object-contain rounded-lg border border-gray-200"
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            {product.name}
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>
          <p className="text-2xl font-semibold text-blue-600 mb-6">
            ${product.price.toFixed(2)}
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

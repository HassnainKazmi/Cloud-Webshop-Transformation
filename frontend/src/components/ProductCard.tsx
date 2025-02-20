import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, description, price, image }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useCart();

  const handleImageLoad = () => setIsLoading(false);
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { id, name, price, quantity: 1, image },
    });
  };

  return (
    <div
      className="product-card group relative rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl cursor-pointer"
      onClick={() => navigate(`/product/${id}`)}
    >
      {/* Product Image */}
      <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin"></div>
          </div>
        )}
        {hasError ? (
          <div className="text-gray-500 text-sm">Image not available</div>
        ) : (
          <img
            src={image}
            alt={name}
            className={`w-full h-40 object-cover transition-transform duration-300 ease-in-out transform ${
              isLoading ? "hidden" : ""
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        {/* Minimal Blur on Hover with Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 ease-in-out">
          <span className="text-white text-lg font-semibold">View Details</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500 mt-2">{description}</p>
        <p className="text-lg font-semibold text-blue-600 mt-3">${price.toFixed(2)}</p>

        {/* Add to Cart Button */}
        <button
          className="mt-4 w-full px-6 py-3 bg-green-500 text-white text-lg font-medium rounded-lg shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
        >
          Add to Cart
        </button>

        <button
          className="mt-4 w-full px-6 py-3 bg-orange-500 text-white text-lg font-medium rounded-lg shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={() => {
            // alert("Buy Now functionality to be implemented");
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

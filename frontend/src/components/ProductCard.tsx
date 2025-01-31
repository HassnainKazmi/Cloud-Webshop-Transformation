import React, { useState } from "react";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  description,
  price,
  image,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="product-card rounded-lg shadow-lg hover:scale-103 hover:shadow-2xl transition-all duration-300 ease-in-out border border-gray-200">
      <div className="w-full h-40 rounded-t-lg bg-gray-100 flex items-center justify-center relative">
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
            className={`w-full h-40 object-cover rounded-t-lg ${
              isLoading ? "hidden" : ""
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500 mt-2">{description}</p>
        <p className="text-lg font-semibold text-gray-900 mt-3">
          ${price.toFixed(2)}
        </p>
        <button className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition duration-300">
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

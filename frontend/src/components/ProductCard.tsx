import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

interface ProductCardProps {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, description, price, image }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useCart();

  const handleImageLoad = () => setIsLoading(false);
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);

    dispatch({
      type: "ADD_TO_CART",
      payload: { id, name, price, quantity: 1, image },
    });

    toast.success(`${name} added to cart! 🛒`, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "light",
    });

    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <motion.div
      className="product-card group relative rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl cursor-pointer flex flex-col"
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/product/${id}`)}
    >
      <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin"></div>
          </div>
        )}
        {hasError ? (
          <div className="text-gray-500 text-sm">Image not available</div>
        ) : (
          <motion.img
            src={`${import.meta.env.VITE_IMAGE_BASE_URL}${id}.jpg`}
            alt={name}
            className={`w-full h-40 object-cover transition-transform duration-300 ease-in-out transform ${
              isLoading ? "hidden" : ""
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 ease-in-out">
          <span className="text-white text-lg font-semibold">View Details</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500 mt-2 flex-grow">{description}</p>
        <p className="text-lg font-semibold text-blue-600 my-3">${price.toFixed(2)}</p>

        <motion.button
          className="mt-auto w-full px-6 py-3 text-white text-lg font-medium rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
          style={{
            backgroundColor: isAdded ? "#10B981" : "#16A34A",
            boxShadow: isAdded ? "0px 4px 15px rgba(16, 185, 129, 0.4)" : "none",
          }}
          onClick={handleAddToCart}
          whileTap={{ scale: 0.9 }}
        >
          {isAdded ? "✔ Added" : "Add to Cart"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;

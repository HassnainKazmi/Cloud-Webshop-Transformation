import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import ProductType from "../types/types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useCart();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const navigate = useNavigate();

  const placeholderImage = "https://via.placeholder.com/500?text=No+Image+Available";

  useEffect(() => {
    const getProduct = async () => {
      const response = await fetch(
        `https://cloud-webshop-backend-gxhqcxhmguc7brg0.germanywestcentral-01.azurewebsites.net/api/product/${id}`
      );

      if (!response.ok) {
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setProduct(data);
      setIsLoading(false);
    };

    if (id) {
      getProduct();
    }
  }, [id]);

  const handleAddToCart = (navigateToCheckout = false) => {
    if (product) {
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
      toast.success(`${product.name} added to cart! 🛒`, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });

      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1200);

      if (navigateToCheckout) {
        navigate("/cart");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Navbar />
        <h1 className="text-xl font-bold">Loading Product...</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Navbar />
        <h1 className="text-xl font-bold text-red-600">Product Not Found</h1>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 ease-in-out"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-10 px-4 py-6">
      <Navbar />
      <div className="mb-4 mt-10">
        <button
          onClick={() => window.history.back()}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg shadow-md hover:bg-gray-300 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          ← Back to Catalog
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-6 transition-all duration-300 ease-in-out">
        <div className="relative flex justify-center items-center">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin"></div>
            </div>
          )}
          <img
            src={
              hasImageError ? placeholderImage : `${import.meta.env.VITE_IMAGE_BASE_URL}${id}.jpg`
            }
            alt={product.name}
            className={`max-w-full max-h-[500px] object-contain rounded-lg shadow-lg border border-gray-200 transition-transform duration-300 ease-in-out hover:scale-105 ${
              isImageLoading ? "hidden" : ""
            }`}
            onLoad={() => setIsImageLoading(false)}
            onError={() => {
              setIsImageLoading(false);
              setHasImageError(true);
            }}
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">{product.name}</h1>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">{product.description}</p>
            <p className="text-3xl font-semibold text-blue-600 mb-6">${product.price.toFixed(2)}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <motion.button
              className="flex-1 px-6 py-3 text-white text-lg font-medium rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
              style={{
                backgroundColor: isAdded ? "#10B981" : "#16A34A",
                boxShadow: isAdded ? "0px 4px 15px rgba(16, 185, 129, 0.4)" : "none",
              }}
              onClick={() => handleAddToCart(false)}
              whileTap={{ scale: 0.9 }}
            >
              {isAdded ? "✔ Added" : "Add to Cart"}
            </motion.button>
            <button
              className="flex-1 px-6 py-3 bg-orange-500 text-white text-lg font-medium rounded-lg shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={() => handleAddToCart(true)}
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

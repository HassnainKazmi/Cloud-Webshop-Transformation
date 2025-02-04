import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar: React.FC = () => {
  const { state } = useCart();
  const navigate = useNavigate();

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav
      className="fixed top-0 left-0 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg z-50
      transition-transform duration-500 ease-out will-change-transform"
      style={{ transform: "translateZ(0)" }} // Forces GPU acceleration
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1
          className="text-white text-2xl font-bold cursor-pointer tracking-wider hover:text-gray-300 transition-all duration-300"
          onClick={() => navigate("/")}
        >
          WebShop
        </h1>

        {/* Cart Icon */}
        <div
          className="relative cursor-pointer hover:scale-110 transition-transform duration-300"
          onClick={() => navigate("/cart")}
        >
          <img src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png" alt="Cart" className="w-8 h-8 invert" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow-md">
              {totalItems}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
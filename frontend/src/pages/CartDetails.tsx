import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const CartDetails: React.FC = () => {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  const handleRemoveFromCart = (id: number) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity > 0) {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    } else {
      handleRemoveFromCart(id);
    }
  };

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckOut = async () => {
    const products = state.items.map((p) => ({
      product_id: p.id,
      quantity: p.quantity,
    }));

    const response = await fetch(
      "https://cloud-webshop-backend-gxhqcxhmguc7brg0.germanywestcentral-01.azurewebsites.net/api/order/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products,
        }),
      }
    );
    if (response.status === 201) {
      navigate("/user/checkout");
    }
  };

  return (
    <div className="container mx-auto my-10 px-4 py-6">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Shopping Cart</h1>

      {state.items.length > 0 ? (
        <div className="bg-white shadow-md p-6 rounded-lg">
          <ul className="divide-y divide-gray-200">
            {state.items.map((item) => (
              <li key={item.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={`${import.meta.env.VITE_IMAGE_BASE_URL}${item.id}.jpg`}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg shadow-md border"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-sm text-red-600 hover:underline hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-blue-600">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 text-right">
            <p className="text-lg font-bold text-gray-800">Total Items: {totalItems}</p>
            <p className="text-xl font-bold text-blue-600">Total Price: ${totalPrice.toFixed(2)}</p>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition"
            >
              Continue Shopping
            </button>
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              onClick={() => handleCheckOut()}
            >
              Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
            alt="Empty Cart"
            className="w-32 h-32 mx-auto mb-6 opacity-70"
          />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Your cart is empty!</h2>
          <p className="text-gray-500 mb-6">Browse products and add items to your cart.</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Back to Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default CartDetails;

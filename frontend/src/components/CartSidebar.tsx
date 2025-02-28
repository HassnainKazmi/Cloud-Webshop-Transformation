import { useCart } from "../context/CartContext";

const CartSidebar = () => {
  const { state, dispatch } = useCart();

  const handleRemoveFromCart = (id: number) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = state.items.reduce((total, item) => total + item.price, 0);

  return (
    <div className="cart-sidebar p-4 bg-gray-100 shadow-lg">
      <h2 className="text-lg font-bold mb-4">Shopping Cart</h2>
      {state.items.length > 0 ? (
        <>
          <ul>
            {state.items.map((item) => (
              <li key={item.id} className="mb-4">
                <div className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="text-red-600 underline"
                  >
                    Remove
                  </button>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleQuantityChange(item.id, Math.max(item.quantity - 1, 1))}
                      className="px-2"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="px-2"
                    >
                      +
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <p>
              Total Items: <strong>{totalItems}</strong>
            </p>
            <p>
              Total Price: <strong>${totalPrice.toFixed(2)}</strong>
            </p>
          </div>
        </>
      ) : (
        <p>Your cart is empty!</p>
      )}
    </div>
  );
};
export default CartSidebar;

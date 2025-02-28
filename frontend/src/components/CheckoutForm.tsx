import { useCallback, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const CheckoutForm = () => {
  const { state } = useCart();
  const [clientSecret, setClientSecret] = useState(null);

  const fetchClientSecret = useCallback(async () => {
    if (state.items.length === 0) return;

    const cartProducts = state.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    try {
      const res = await fetch(
        "https://cloud-webshop-backend-gxhqcxhmguc7brg0.germanywestcentral-01.azurewebsites.net/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ line_items: cartProducts }),
        }
      );

      if (!res.ok) throw new Error("Failed to fetch client secret");

      const data = await res.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error fetching client secret:", error);
    }
  }, [state.items]);

  useEffect(() => {
    fetchClientSecret();
  }, [fetchClientSecret]);

  return (
    <div id="checkout" className="flex justify-center items-start min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col items-center">
        {/* Payment Section */}
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
          {clientSecret ? (
            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          ) : (
            <p className="text-center text-gray-700">Loading checkout...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;

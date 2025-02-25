import { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const CheckoutForm = () => {
  /**
   * In the useCallback hook we are doing a couple of things. Depending on how your project is set up, the goal is to retrieve the list of products your user has selected and then send a post request to obtain the secrete key.
   */
  const fetchClientSecret = useCallback(async () => {
    //get array of Products
    //send array of products to backend
    // const getClientSecret = await postData('/api/user/create-checkout-session', parsedCartList)
    const res = await fetch("http://127.0.0.1:5000/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const getClientSecret = await res.json();
    console.log({ getClientSecret });
    //return the clientSecrete
    return getClientSecret.clientSecret;
  }, []);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default CheckoutForm;

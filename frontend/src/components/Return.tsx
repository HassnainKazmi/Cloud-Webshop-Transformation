import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";

const Return = () => {
  const [checkoutData, setCheckoutData] = useState({ status: null, customerEmail: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const checkoutSessionStatus = async () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get("session_id");

      console.log("making API call with id: " + sessionId);

      try {
        const res = await fetch(
          "https://cloud-webshop-backend-gxhqcxhmguc7brg0.germanywestcentral-01.azurewebsites.net/api/stripe/status?session_id=" +
            sessionId
        );

        if (!res.ok) {
          throw new Error("Failed to fetch session status");
        }

        const checkoutStatus = await res.json();
        console.log({ checkoutStatus });

        if (checkoutStatus.status === "complete") {
          console.log("Checkout status complete");
        }
        setCheckoutData({
          status: checkoutStatus.status,
          customerEmail: checkoutStatus.customer_email || "",
        });
      } catch (error) {
        console.error("Error fetching checkout status:", error);
      }
    };

    checkoutSessionStatus();
  }, []);

  const handleClick = () => {
    navigate("/");
  };

  if (checkoutData.status === "open") {
    return <Navigate to="/user/checkout" />;
  }

  if (checkoutData.status === "complete") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <section className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
          <div className="flex justify-center items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-green-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9 16.2l-5.2-5.2-1.4 1.4L9 19 22 6 20.6 4.6 9 16.2z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-700">
            <span className="text-green-600 font-bold">Payment successful!</span> Thank you for your
            purchase. A confirmation email has been sent to{" "}
            <span className="text-blue-600 font-bold">{checkoutData.customerEmail}</span>.
          </p>
          <button
            onClick={handleClick}
            className="mt-5 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Back to Home!
          </button>
        </section>
      </div>
    );
  }

  return null;
};

export default Return;

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
      <div className="flex justify-center items-center min-h-screen">
        <section className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
          <p className="text-lg font-semibold text-gray-700">
            We appreciate your business! A confirmation email will be sent to{" "}
            <span className="text-blue-600 font-bold">{checkoutData.customerEmail}</span>.
          </p>
          <button
            onClick={handleClick}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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

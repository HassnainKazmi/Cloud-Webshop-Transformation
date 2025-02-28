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
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{" "}
          {checkoutData.customerEmail}.
        </p>
        <button onClick={handleClick}>Back to Home!</button>
      </section>
    );
  }

  return null;
};

export default Return;

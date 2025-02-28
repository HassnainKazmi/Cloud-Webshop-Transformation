import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    const checkoutSessionStatus = async () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get("session_id");
      const res = await fetch("http://0.0.0.0:5000/api/stripe/status?session_id=" + sessionId);
      const checkoutStatus = await res.json();
      console.log({ checkoutStatus });
      if (checkoutStatus) {
        setStatus(checkoutStatus.status);
        setCustomerEmail(checkoutStatus.customer_email);
      }
    };
    checkoutSessionStatus();
  }, []);

  if (status === "open") {
    return <Navigate to="/user/checkout" />;
  }
  if (status === "complete") {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}. If you
          have any questions, please email{" "}
          <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    );
  }

  return null;
};

export default Return;

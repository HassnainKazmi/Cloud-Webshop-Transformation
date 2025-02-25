import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    const checkoutSessionStatus = async () => {
      // returns the query string from the current URL of the web page
      const queryString = window.location.search;
      //URLSearchParams is a built-in javascript object
      //that allows you to work with query string parameters
      //provides methods for appending, deleting, getting, and
      //setting key-value pairs in a query string.
      const urlParams = new URLSearchParams(queryString);
      //In this case we are going to the the session_id from the urlParams
      const sessionId = urlParams.get("session_id");
      //send the session_id and fetch for the checkout-session status
      //   const checkoutStatus = await getData(
      //     /api/user/session-status?session_id=${sessionId}
      //   );
      const res = await fetch("http://0.0.0.0:5000/api/stripe/status?session_id=" + sessionId);
      const checkoutStatus = await res.json();
      console.log({ checkoutStatus });
      // if checkoutstatus was successful
      if (checkoutStatus) {
        // Set the status and email to the states
        setStatus(checkoutStatus.status);
        setCustomerEmail(checkoutStatus.customer_email);
        //remove cart items from users cart in the database
        //remove cart items from localStorage, useContext, or etc.
        //reset cart items in cart to 0
      }
    };
    checkoutSessionStatus();
  }, []);

  //if status is open, redirect user to the checkout page
  if (status === "open") {
    return <Navigate to="/user/checkout" />;
  }
  //if status is complete, display a message for the user to know that their
  //payment was either successful or they need to try again.
  if (status === "complete") {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}. If you have any questions,
          please email <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    );
  }

  return null;
};

export default Return;

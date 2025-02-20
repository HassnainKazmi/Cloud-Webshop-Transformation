import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ProductCatalog from "./pages/ProductCatalog";
import ProductDetails from "./pages/ProductDetails";
import CartDetails from "./pages/CartDetails";

const App: React.FC = () => {
  const location = useLocation(); // Get current location

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="page" timeout={300}>
        <Routes location={location}>
          <Route path="/" element={<ProductCatalog />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartDetails />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default App;

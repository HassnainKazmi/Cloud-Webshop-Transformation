import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductCatalog from "./pages/ProductCatalog";
// import ProductDetails from "./pages/ProductDetails";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductCatalog />}></Route>
      {/* <Route path="/product/:id" element={<ProductDetails />}></Route> */}
    </Routes>
  );
};
export default App;

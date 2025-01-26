import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductCatalog from "./pages/ProductCatalog";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductCatalog />}></Route>
    </Routes>
  );
};
export default App;

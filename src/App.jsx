import { BrowserRouter, Route, Routes } from "react-router-dom";
import DrArneroCardShop from "./pages/DrArneroCardShop";
import ProductCatalogPage from "./pages/ProductCatalogPage";

export default function App() {
  return (
    <BrowserRouter basename="/arnero">
      <Routes>
        <Route path="/" element={<DrArneroCardShop />} />
        <Route path="/products" element={<ProductCatalogPage />} />
      </Routes>
    </BrowserRouter>
  );
}

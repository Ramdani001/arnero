import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

const DrArneroCardShop = lazy(() => import("./pages/DrArneroCardShop"));
const ProductCatalogPage = lazy(() => import("./pages/ProductCatalogPage"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0c1730] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-[#bbe150]/20 border-t-[#bbe150] rounded-full animate-spin" />
        <span className="text-xs font-semibold tracking-widest text-[#bbe150] uppercase font-sans">
          Memuat Arnero...
        </span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<DrArneroCardShop />} />
          <Route path="/products" element={<ProductCatalogPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

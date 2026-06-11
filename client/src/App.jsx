import { useState } from "react";
import "./App.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import AppLayout from "./components/AppLayout";

import Dashboard from "./pages/Dashboard/Dashboard";

import CMS from "./pages/CMS/CMS";

import Company from "./pages/Company/Company";
import CreateCompany from "./pages/Company/CreateCompany";
import EditCompany from "./pages/Company/EditCompany";
import ViewCompany from "./pages/Company/ViewCompany";

import Brand from "./pages/Brand/Brand";
import CreateBrand from "./pages/Brand/CreateBrand";
import EditBrand from "./pages/Brand/EditBrand";
import ViewBrand from "./pages/Brand/ViewBrand";

import Seller from "./pages/Seller/Seller";
import CreateSeller from "./pages/Seller/CreateSeller";
import EditSeller from "./pages/Seller/EditSeller";
import ViewSeller from "./pages/Seller/ViewSeller";

import Customer from "./pages/Customer/Customer";
import CreateCustomer from "./pages/Customer/CreateCustomer";
import EditCustomer from "./pages/Customer/EditCustomer";
import ViewCustomer from "./pages/Customer/ViewCustomer";

import Products from "./pages/Products/Products";
import EditProducts from "./pages/Products/EditProducts";

import Offers from "./pages/Offers/Offers";
import CreateOffers from "./pages/Offers/CreateOffers";
import EditOffers from "./pages/Offers/EditOffers";
import ViewOffers from "./pages/Offers/ViewOffers";

import Coupons from "./pages/Coupons/Coupons";
import CreateCoupons from "./pages/Coupons/CreateCoupons";
import EditCoupons from "./pages/Coupons/EditCoupons";
import ViewCoupons from "./pages/Coupons/ViewCoupons";

import Articles from "./pages/Articles/Articles";
import ArticleForm from "./components/form/ArticleForm";

import ArticleCategories from "./pages/ArticleCategories/ArticleCategories";

import Settings from "./pages/Settings/Settings";
import Tax from "./pages/Settings/Tax/Tax";
import Hsn from "./pages/Settings/Hsn/Hsn";
import Specification from "./pages/Settings/Specification/Specification";
import SpecificationDetails from "./pages/Settings/SpecificationDetails/SpecificationDetails";
import ProductCategories from "./pages/Settings/ProductCategories/ProductCategories";
import Tools from "./pages/Settings/Tools/Tools";

import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/cms" element={<CMS />} />

              <Route path="/company" element={<Company />} />
              <Route path="/company/create" element={<CreateCompany />} />
              <Route path="/company/edit/:id" element={<EditCompany />} />
              <Route path="/company/view/:id" element={<ViewCompany />} />

              <Route path="/brand" element={<Brand />} />
              <Route path="/brand/create" element={<CreateBrand />} />
              <Route path="/brand/edit/:id" element={<EditBrand />} />
              <Route path="/brand/view/:id" element={<ViewBrand />} />

              <Route path="/seller" element={<Seller />} />
              <Route path="/seller/create" element={<CreateSeller />} />
              <Route path="/seller/edit/:id" element={<EditSeller />} />
              <Route path="/seller/view/:id" element={<ViewSeller />} />

              <Route path="/customer" element={<Customer />} />
              <Route path="/customer/create" element={<CreateCustomer />} />
              <Route path="/customer/edit/:id" element={<EditCustomer />} />
              <Route path="/customer/view/:id" element={<ViewCustomer />} />

              <Route path="/products" element={<Products />} />
              <Route path="/products/edit/:id" element={<EditProducts />} />

              <Route path="/offers" element={<Offers />} />
              <Route path="/offers/create" element={<CreateOffers />} />
              <Route path="/offers/edit/:id" element={<EditOffers />} />
              <Route path="/offers/view/:id" element={<ViewOffers />} />

              <Route path="/coupons" element={<Coupons />} />
              <Route path="/coupons/create" element={<CreateCoupons />} />
              <Route path="/coupons/edit/:id" element={<EditCoupons />} />
              <Route path="/coupons/view/:id" element={<ViewCoupons />} />

              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/create" element={<ArticleForm />} />
              <Route path="/articles/edit/:id" element={<ArticleForm />} />

              <Route
                path="/article_categories"
                element={<ArticleCategories />}
              />

              <Route path="/settings" element={<Settings />} />
              <Route
                path="/settings/product_categories"
                element={<ProductCategories />}
              />
              <Route path="/settings/tax" element={<Tax />} />
              <Route path="/settings/hsn" element={<Hsn />} />
              <Route
                path="/settings/specification"
                element={<Specification />}
              />
              <Route
                path="/settings/specification_details"
                element={<SpecificationDetails />}
              />
              <Route path="/settings/tools" element={<Tools />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </>
  );
}

export default App;

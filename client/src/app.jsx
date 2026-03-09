import React from "react";
import HomePage from "./pages/Homepage.jsx";
import CheckoutPage from "./pages/checkoutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import UserPage from "./pages/UserPage.jsx";
import Wishlist from "./pages/wishlist";
import SearchPage from "./pages/SearchPage.jsx";
import Header from "./components/header.jsx";
import Navbar from "./components/navbar.jsx";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </>
  );
}

export default App;
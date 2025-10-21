import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Auctions from './components/Auctions';
import Categories from './components/Categories';
import AuctionDetail from './components/AuctionDetail';
import AuctionList from "./components/AuctionList";
import UserProfile from "./components/UserProfile";
import Login from './components/Login';
import Register from './components/Register';
import CreateAuction from './components/CreateAuction';
import BuyerHome from "./components/buyer/BuyerHome";
import SellerHome from "./components/seller/SellerHome";
import AdminHome from "./components/admin/AdminHome";
import Profile from "./components/Profile";
import './App.css';

function App() {
    let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (err) {
    console.error("Error reading user from localStorage:", err);
  }
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route
            path="/"
            element={
              !user ? (
                <Home />
              ) : user.role === "Buyer" ? (
                <BuyerHome />
              ) : user.role === "Seller" ? (
                <SellerHome />
              ) : (
                <AdminHome />
              )
            }
          />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/auction/:id" element={<AuctionDetail />} />
          {/* <Routes>
            ...existing routes */}
            <Route path="/profile" element={<Profile />} />
          {/* </Routes> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-auction" element={<CreateAuction />} />
          <Route path="/buyer/home" element={<BuyerHome />} />
          <Route path="/seller/home" element={<SellerHome />} />
          <Route path="/admin/home" element={<AdminHome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

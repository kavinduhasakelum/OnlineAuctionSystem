// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Utility to get current user from localStorage
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (err) {
    console.error("Error reading user from localStorage:", err);
    return null;
  }
};

// PrivateRoute wrapper
const PrivateRoute = ({ children, roles }) => {
  const user = getUser();
  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    // Role not authorized
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const user = getUser();

  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/auction/:id" element={<AuctionDetail />} />
          <Route path="/" element={!user ? <Home /> : (
            user.role === "Buyer" ? <BuyerHome /> :
            user.role === "Seller" ? <SellerHome /> :
            <AdminHome />
          )} />

          {/* Private Routes */}
          <Route path="/buyer/home" element={
            <PrivateRoute roles={['Buyer']}>
              <BuyerHome />
            </PrivateRoute>
          }/>
          <Route path="/seller/home" element={
            <PrivateRoute roles={['Seller']}>
              <SellerHome />
            </PrivateRoute>
          }/>
          <Route path="/admin/home" element={
            <PrivateRoute roles={['Admin']}>
              <AdminHome />
            </PrivateRoute>
          }/>
          <Route path="/profile" element={
            <PrivateRoute roles={['Buyer', 'Seller', 'Admin']}>
              <Profile />
            </PrivateRoute>
          }/>
          <Route path="/create-auction" element={
            <PrivateRoute roles={['Seller','Admin']}>
              <CreateAuction />
            </PrivateRoute>
          }/>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

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
import BuyerAuctionDetail from "./components/buyer/AuctionDetail";
import MyBids from "./components/buyer/MyBids";
import MyOrders from "./components/buyer/MyOrders";
import SellerHome from "./components/seller/SellerHome";
import CreateProduct from "./components/seller/CreateProduct";
import ProductDetail from "./components/seller/ProductDetail";
import AdminHome from "./components/admin/AdminHome";
import ManageUsers from "./components/admin/ManageUsers";
import ManageAuctions from "./components/admin/ManageAuctions";
import AdminDashboard from "./components/admin/AdminDashboard";
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
          {/* <Route path="/auction/:id" element={<AuctionDetail />} /> */}
          <Route path="/" element={!user ? <Home /> : (
            user.role === "Buyer" ? <BuyerHome /> :
            user.role === "Seller" ? <SellerHome /> :
            <AdminHome />
          )} />

          {/* Private Routes */}
          <Route path="/product/:id" element={
            <PrivateRoute roles={['Seller']}>
              <AuctionDetail /> {/* Reusing AuctionDetail for simplicity */}
            </PrivateRoute>
          }/>
          <Route path="/buyer/home" element={
            <PrivateRoute roles={['Buyer']}>
              <BuyerHome />
            </PrivateRoute>
          }/>
          <Route path="/buyer/auction/:id" element={
            <PrivateRoute roles={['Buyer']}>
              <BuyerAuctionDetail />
            </PrivateRoute>
          }/>
          <Route path="/buyer/my-bids" element={
            <PrivateRoute roles={['Buyer']}>
              <MyBids />
            </PrivateRoute>
          }/>
          <Route path="/buyer/my-orders" element={
            <PrivateRoute roles={['Buyer']}>
              <MyOrders />
            </PrivateRoute>
          }/>
          <Route path="/auction/:id" element={
            <PrivateRoute roles={['Buyer', 'Seller', 'Admin']}>
              <AuctionDetail />
            </PrivateRoute>
          }/>
          <Route path="/seller/home" element={
            <PrivateRoute roles={['Seller']}>
              <SellerHome />
            </PrivateRoute>
          }/>
          <Route path="/seller/create-product" element={
            <PrivateRoute roles={['Seller', 'Admin']}>
              <CreateProduct />
            </PrivateRoute>
          }/>
          <Route path="/seller/products/:id" element={
            <PrivateRoute roles={['Seller', 'Admin']}>
              <ProductDetail />
            </PrivateRoute>
          }/>
          <Route path="/admin/home" element={
            <PrivateRoute roles={['Admin']}>
              <AdminHome />
            </PrivateRoute>
          }/>
          <Route path="/admin/users" element={
            <PrivateRoute roles={['Admin']}>
              <ManageUsers />
            </PrivateRoute>
          }/>
          <Route path="/admin/auctions" element={
            <PrivateRoute roles={['Admin']}>
              <ManageAuctions />
            </PrivateRoute>
          }/>
          <Route path="/admin/dashboard" element={
            <PrivateRoute roles={['Admin']}>
              <AdminDashboard />
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

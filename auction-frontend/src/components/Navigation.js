import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3" to="/">
          🏆 ELITE AUCTIONS
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            
            {/* Buyer Dashboard Link */}
            {user?.user?.role === 'Buyer' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/buyer">
                    <i className="bi bi-grid me-1"></i>Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/buyer/my-bids">
                    <i className="bi bi-list-check me-1"></i>My Bids
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/buyer/my-orders">
                    <i className="bi bi-bag-check me-1"></i>My Orders
                  </Link>
                </li>
              </>
            )}
            
            {/* Seller Dashboard Link */}
            {user?.user?.role === 'Seller' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/seller/home">
                    <i className="bi bi-grid me-1"></i>Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/seller/create-product">
                    <i className="bi bi-plus-circle me-1"></i>Create Product
                  </Link>
                </li>
              </>
            )}
            
            {/* Admin Dashboard Link */}
            {user?.user?.role === 'Admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i>Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/users">
                    <i className="bi bi-people me-1"></i>Manage Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/auctions">
                    <i className="bi bi-hammer me-1"></i>Manage Auctions
                  </Link>
                </li>
              </>
            )}
            
            <li className="nav-item">
              <Link className="nav-link" to="/auctions">Auctions</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categories">Categories</Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    {/* 👤 {user.user.firstName} */}
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light ms-2" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">Register</Link>
            </li>
            </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

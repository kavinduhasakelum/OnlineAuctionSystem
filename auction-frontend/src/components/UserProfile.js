import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          Loading user profile...
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">User Profile</h3>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-4 fw-bold">User ID:</div>
                <div className="col-md-8">{user.id}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-bold">First Name:</div>
                <div className="col-md-8">{user.firstName}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-bold">Last Name:</div>
                <div className="col-md-8">{user.lastName}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-bold">Email:</div>
                <div className="col-md-8">{user.email}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-bold">Role:</div>
                <div className="col-md-8">
                  <span className={`badge ${user.role === 'Admin' ? 'bg-danger' : user.role === 'Seller' ? 'bg-success' : 'bg-primary'}`}>
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="alert alert-info mb-0">
                <strong>Note:</strong> More profile features like edit profile, change password, and activity history will be added in future updates.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

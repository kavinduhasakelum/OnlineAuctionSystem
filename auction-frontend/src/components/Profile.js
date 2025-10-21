import React from "react";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <div className="container mt-4">
        <h4>Please log in to view your profile.</h4>
      </div>
    );
  }
    const firstName = user?.user?.firstName || "N/A";
    const lastName = user?.user?.lastName || "N/A";
    const email = user?.user?.email || "N/A";
    const role = user?.user?.role || "N/A";

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 col-md-6 mx-auto">
        <h3 className="text-center text-success mb-4">👤 My Profile</h3>
        <div className="mb-3">
          <strong>First Name:</strong> {firstName}
        </div>
        <div className="mb-3">
          <strong>Last Name:</strong> {lastName}
        </div>
        <div className="mb-3">
          <strong>Email:</strong> {email}
        </div>
        <div className="mb-3">
          <strong>Role:</strong> {role}
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-outline-success">Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

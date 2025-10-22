import React from "react";

const Profile = () => {
    const userString = localStorage.getItem("user");
    let user = {};
    let firstName = "";
    let role = "";
    let email = "";
    let lastName = "";

    if (userString) {
        try {
            user = JSON.parse(userString);
            firstName = user.firstName || "";
            role = user.role || "";
            email = user.email || "";
            lastName = user.lastName || ""; 
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
        }
    }

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

        {/* <div className="text-center mt-4">
          <button className="btn btn-outline-success">Edit Profile</button>
        </div> */}
      </div>
    </div>
  );
};

export default Profile;

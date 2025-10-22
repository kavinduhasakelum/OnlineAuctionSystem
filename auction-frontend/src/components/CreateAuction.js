import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api'; // axios instance

const CreateAuction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startPrice: '',
    startTime: '',
    endTime: '',
    minBidIncrement: '',
    images: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const seller = JSON.parse(localStorage.getItem('user'));
    if (!seller) {
      alert('Please login as seller.');
      navigate('/login');
      return;
    }

    try {
      // ✅ Build FormData (multipart/form-data)
      const data = new FormData();
      data.append('SellerId', seller.id);
      data.append('Name', formData.name);
      data.append('Description', formData.description);
      data.append('StartPrice', formData.startPrice);
      data.append('StartTime', formData.startTime);
      data.append('EndTime', formData.endTime);
      data.append('MinBidIncrement', formData.minBidIncrement);

      // ✅ Append all images using correct key (case-sensitive for .NET binding)
      formData.images.forEach(file => {
        data.append('Images', file);
      });

      // 🧠 Optional: Debug to verify keys before sending
      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }

      // ✅ Send request to backend
      const response = await api.post('/ProductsApi', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Auction created:', response.data);
      alert('Auction created successfully!');
      navigate('/auctions');
    } catch (error) {
      console.error('Error creating auction:', error.response?.data || error.message);
      alert('Failed to create auction. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Create New Auction</h2>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-control"
                    rows="4"
                    required
                  />
                </div>

                {/* Price and Images */}
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Start Price ($) *</label>
                    <input
                      type="number"
                      name="startPrice"
                      value={formData.startPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Min Bid Increment ($) *</label>
                    <input
                      type="number"
                      name="minBidIncrement"
                      value={formData.minBidIncrement}
                      onChange={handleChange}
                      min="1"
                      step="0.01"
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Images *</label>
                    <input
                      type="file"
                      name="images"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="form-control"
                      multiple
                      required
                    />
                  </div>
                </div>

                {/* Time */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Start Time *</label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">End Time *</label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-md-2"
                    onClick={() => navigate('/auctions')}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    Create Auction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAuction;

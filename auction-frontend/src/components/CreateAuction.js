import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api'; // your axios instance

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
    setFormData(prev => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const seller = JSON.parse(localStorage.getItem('user'));
    if (!seller) {
      alert('Please login as seller.');
      navigate('/login');
      return;
    }

    // Build FormData for multipart/form-data
    const data = new FormData();
    data.append('sellerId', seller.id);  // backend expects SellerId
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('startPrice', formData.startPrice);
    data.append('startTime', formData.startTime);
    data.append('endTime', formData.endTime);
    data.append('minBidIncrement', formData.minBidIncrement);

    // Append multiple images
    formData.images.forEach(file => {
      data.append('images', file);  // backend should accept IFormFile collection named 'images'
    });

    try {
      const response = await api.post('/ProductsApi', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const productId = response.data.id;
      console.log('Auction created:', response.data);

      if (formData.images.length > 0) {
        const imageData = new FormData();
        formData.images.forEach(file => imageData.append('images', file));

        await api.post(`/ProductsApi/${productId}/images`, imageData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
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
                      onChange={handleFileChange}
                      className="form-control"
                      multiple
                      required
                    />
                  </div>
                </div>

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

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button type="button" className="btn btn-secondary me-md-2" onClick={() => navigate('/auctions')}>
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

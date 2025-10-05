import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAuction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    startingPrice: '',
    reservePrice: '',
    bidIncrement: '',
    duration: '7',
    condition: 'excellent',
    imageUrl: ''
  });

  const categories = [
    'Jewelry', 'Electronics', 'Art', 'Vehicles', 
    'Fashion', 'Collectibles', 'Home', 'Sports'
  ];

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const durations = [
    { value: '1', label: '1 Day' },
    { value: '3', label: '3 Days' },
    { value: '7', label: '7 Days' },
    { value: '14', label: '14 Days' },
    { value: '30', label: '30 Days' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Auction created:', formData);
    alert('Auction created successfully!');
    navigate('/auctions');
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
                {/* Item Details */}
                <div className="mb-4">
                  <h4 className="border-bottom pb-2">Item Details</h4>
                  
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label fw-bold">Item Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Vintage Rolex Watch 1960s"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label fw-bold">Description *</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your item in detail..."
                      required
                    ></textarea>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="category" className="form-label fw-bold">Category *</label>
                      <select
                        className="form-select"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="condition" className="form-label fw-bold">Condition *</label>
                      <select
                        className="form-select"
                        id="condition"
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        required
                      >
                        {conditions.map(condition => (
                          <option key={condition.value} value={condition.value}>
                            {condition.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label fw-bold">Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                    />
                    <div className="form-text">
                      Provide a URL to your item's image. We recommend using image hosting services.
                    </div>
                  </div>
                </div>

                {/* Auction Settings */}
                <div className="mb-4">
                  <h4 className="border-bottom pb-2">Auction Settings</h4>
                  
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label htmlFor="startingPrice" className="form-label fw-bold">Starting Price ($) *</label>
                      <input
                        type="number"
                        className="form-control"
                        id="startingPrice"
                        name="startingPrice"
                        value={formData.startingPrice}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label htmlFor="reservePrice" className="form-label fw-bold">Reserve Price ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="reservePrice"
                        name="reservePrice"
                        value={formData.reservePrice}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="Optional"
                      />
                      <div className="form-text">
                        Minimum price you're willing to accept
                      </div>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label htmlFor="bidIncrement" className="form-label fw-bold">Bid Increment ($) *</label>
                      <input
                        type="number"
                        className="form-control"
                        id="bidIncrement"
                        name="bidIncrement"
                        value={formData.bidIncrement}
                        onChange={handleChange}
                        min="1"
                        step="1"
                        required
                      />
                      <div className="form-text">
                        Minimum bid increase
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="duration" className="form-label fw-bold">Auction Duration *</label>
                    <select
                      className="form-select"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      required
                    >
                      {durations.map(duration => (
                        <option key={duration.value} value={duration.value}>
                          {duration.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Terms and Submit */}
                <div className="mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="terms"
                      required
                    />
                    <label className="form-check-label" htmlFor="terms">
                      I agree to the Terms of Service and understand that I'm responsible for accurately describing my item.
                    </label>
                  </div>
                </div>

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

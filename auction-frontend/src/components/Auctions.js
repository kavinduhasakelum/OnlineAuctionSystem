import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api'; // axios instance
import { getImageUrl } from '../utils/imageHelper';

const Auctions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [featuredAuctions, setFeaturedAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['All', 'Jewelry', 'Electronics', 'Art', 'Vehicles', 'Fashion', 'Collectibles'];

  // ✅ Fetch all active auctions initially
  const fetchActiveAuctions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ProductsApi/active?limit=6');
      setFeaturedAuctions(response.data);
    } catch (err) {
      console.error('Error fetching auctions:', err);
      setError('Failed to load auctions.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch searched auctions when searchTerm changes
  const fetchSearchResults = async (term) => {
    try {
      if (term.trim() === '') {
        fetchActiveAuctions();
        return;
      }
      setLoading(true);
      const response = await api.get(`/ProductsApi/search?name=${encodeURIComponent(term)}&limit=6`);
      setFeaturedAuctions(response.data);
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Failed to load search results.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchActiveAuctions();
  }, []);

  // ✅ Debounced search (waits 500ms after typing)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSearchResults(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // ✅ Category filter (frontend-only)
  const filteredAuctions = featuredAuctions.filter(auction => {
    if (selectedCategory === 'All') return true;
    return auction.category === selectedCategory;
  });

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="fw-bold mb-4">All Auctions</h1>
          
          {/* Search and Filter */}
          <div className="row mb-4">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search auctions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <select
                className="form-select form-select-lg"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Auction Grid */}
          <div className="row g-4">
            {loading ? (
              <p className="text-center">Loading auctions...</p>
            ) : error ? (
              <p className="text-center text-danger">{error}</p>
            ) : filteredAuctions.length === 0 ? (
              <p className="text-center text-muted">No active auctions found.</p>
            ) : (
              filteredAuctions.map(auction => (
                <div key={auction.id} className="col-md-4">
                  <div className="card h-100 shadow-sm border-0 auction-card">
                    <img 
                      src={
                        auction.images && auction.images.length > 0 
                          ? getImageUrl(auction.images[0].imageUrl)
                          : 'https://via.placeholder.com/400x300?text=No+Image'
                      }
                      className="card-img-top" 
                      alt={auction.name}
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold">{auction.name}</h5>
                      <p className="card-text text-muted flex-grow-1">{auction.description}</p>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="h5 text-primary fw-bold">
                            Rs. {auction.currentPrice?.toLocaleString() ?? auction.startPrice}
                          </span>
                          <span className="badge bg-warning text-dark">
                            {new Date(auction.endTime) > new Date() ? 'Active' : 'Ended'}
                          </span>
                        </div>
                        <Link to={`/auction/${auction.id}`} className="btn btn-primary w-100 py-2 fw-bold">
                          Place Bid
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* No Results Message */}
          {!loading && filteredAuctions.length === 0 && (
            <div className="text-center py-5">
              <h3 className="text-muted">No auctions found</h3>
              <p className="text-muted">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auctions;

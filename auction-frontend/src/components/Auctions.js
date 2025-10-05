import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Auctions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const allAuctions = [
    {
      id: 1,
      title: 'Vintage Rolex Watch',
      description: 'Beautiful vintage Rolex from 1960s',
      currentBid: 2500,
      imageUrl: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=300&fit=crop',
      category: 'Jewelry',
      timeLeft: '2 days left',
      bids: 12
    },
    {
      id: 2,
      title: 'MacBook Pro 2023',
      description: 'Brand new MacBook Pro 16-inch',
      currentBid: 2200,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
      category: 'Electronics',
      timeLeft: '1 day left',
      bids: 8
    },
    {
      id: 3,
      title: 'Antique Persian Rug',
      description: 'Handwoven Persian rug from 19th century',
      currentBid: 1800,
      imageUrl: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=300&fit=crop',
      category: 'Art',
      timeLeft: '3 days left',
      bids: 15
    },
    {
      id: 4,
      title: 'Vintage Camera Collection',
      description: 'Rare vintage camera collection from 1950s',
      currentBid: 1200,
      imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      category: 'Collectibles',
      timeLeft: '5 days left',
      bids: 6
    },
    {
      id: 5,
      title: 'Designer Handbag',
      description: 'Limited edition designer handbag',
      currentBid: 800,
      imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop',
      category: 'Fashion',
      timeLeft: '2 days left',
      bids: 10
    },
    {
      id: 6,
      title: 'Mountain Bike',
      description: 'Professional grade mountain bike',
      currentBid: 1500,
      imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      category: 'Vehicles',
      timeLeft: '4 days left',
      bids: 7
    }
  ];

  const categories = ['All', 'Jewelry', 'Electronics', 'Art', 'Vehicles', 'Fashion', 'Collectibles'];

  const filteredAuctions = allAuctions.filter(auction => {
    const matchesSearch = auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         auction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || auction.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
            {filteredAuctions.map(auction => (
              <div key={auction.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0 auction-card">
                  <img 
                    src={auction.imageUrl} 
                    className="card-img-top" 
                    alt={auction.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title fw-bold">{auction.title}</h5>
                      <span className="badge bg-secondary">{auction.category}</span>
                    </div>
                    <p className="card-text text-muted flex-grow-1">{auction.description}</p>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="h5 text-primary fw-bold"></span>
                        <small className="text-muted">{auction.bids} bids</small>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge bg-warning text-dark">{auction.timeLeft}</span>
                      </div>
                      <Link to={'/auction/' + auction.id} className="btn btn-primary w-100 py-2">
                        View Details & Bid
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAuctions.length === 0 && (
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

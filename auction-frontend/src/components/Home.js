import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { getImageUrl } from '../utils/imageHelper';

const Home = () => {
  // const featuredAuctions = [
  //   {
  //     id: 1,
  //     title: 'Vintage Rolex Watch',
  //     description: 'Beautiful vintage Rolex from 1960s in excellent condition',
  //     currentBid: 2500,
  //     imageUrl: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=300&fit=crop',
  //     timeLeft: '2 days left'
  //   },
  //   {
  //     id: 2,
  //     title: 'MacBook Pro 2023',
  //     description: 'Brand new MacBook Pro 16-inch with M2 chip',
  //     currentBid: 2200,
  //     imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
  //     timeLeft: '1 day left'
  //   },
  //   {
  //     id: 3,
  //     title: 'Antique Persian Rug',
  //     description: 'Handwoven Persian rug from 19th century',
  //     currentBid: 1800,
  //     imageUrl: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=300&fit=crop',
  //     timeLeft: '3 days left'
  //   }
  // ];
  const [featuredAuctions, setFeaturedAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await api.get('/ProductsApi/active?limit=3');
        setFeaturedAuctions(response.data);
      } catch (err) {
        console.error('Error fetching auctions:', err);
        setError('Failed to load auctions.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);


  const categories = [
    { name: 'Jewelry', icon: '💎', link: '/categories' },
    { name: 'Electronics', icon: '📱', link: '/categories' },
    { name: 'Art', icon: '🎨', link: '/categories' },
    { name: 'Vehicles', icon: '🚗', link: '/categories' },
    { name: 'Fashion', icon: '👕', link: '/categories' },
    { name: 'Collectibles', icon: '🏆', link: '/categories' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="container-fluid bg-primary text-white py-5 mb-5">
        <div className="container text-center py-5">
          <h1 className="display-4 fw-bold mb-4">Welcome to Elite Auctions</h1>
          <p className="lead mb-4">Bid on exclusive items and discover unique treasures from around the world</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/auctions" className="btn btn-light btn-lg px-4 py-2 fw-bold">
              Explore Auctions
            </Link>
            <Link to="/create-auction" className="btn btn-outline-light btn-lg px-4 py-2">
              Create Auction
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Auctions Section */}
      <div className="container">
        <h2 className="text-center mb-5 fw-bold">Featured Auctions</h2>
        <div className="row g-4">
          {loading ? (
            <p className="text-center">Loading auctions...</p>
          ) : error ? (
            <p className="text-center text-danger">{error}</p>
          ) : featuredAuctions.length === 0 ? (
            <p className="text-center text-muted">No active auctions found.</p>
          ) : (
            featuredAuctions.map(auction => (
              <div key={auction.id} className="col-md-4">
                <div className="card h-100 shadow-sm border-0 auction-card">
                  <img 
                    src={
                      auction.images && auction.images.length > 0 
                        ? getImageUrl(auction.images[0].imageUrl)
                        : 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=300&fit=crop'
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
                          Rs. {auction.currentPrice.toLocaleString()}
                        </span>
                        <span className="badge bg-warning text-dark">
                          {new Date(auction.endTime) > new Date() 
                            ? 'Active' 
                            : 'Ended'}
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

        {/* Categories Section */}
        <div className="row mt-5 pt-5">
          <div className="col-12 text-center mb-4">
            <h2 className="fw-bold">Browse Categories</h2>
            <p className="text-muted">Discover items by category</p>
          </div>
          {categories.map((category, index) => (
            <div key={index} className="col-md-2 col-4 mb-3">
              <Link to={category.link} className="text-decoration-none">
                <div className="text-center p-3 category-item border rounded-3">
                  <div className="display-6 mb-2">{category.icon}</div>
                  <div className="fw-medium text-dark">{category.name}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { name: 'Jewelry', icon: '💎', description: 'Luxury watches, rings, and precious gems', count: 24 },
    { name: 'Electronics', icon: '📱', description: 'Smartphones, laptops, and gadgets', count: 18 },
    { name: 'Art', icon: '🎨', description: 'Paintings, sculptures, and collectible art', count: 32 },
    { name: 'Vehicles', icon: '🚗', description: 'Cars, motorcycles, and automotive', count: 15 },
    { name: 'Fashion', icon: '👕', description: 'Designer clothes and accessories', count: 28 },
    { name: 'Collectibles', icon: '🏆', description: 'Rare items and memorabilia', count: 41 },
    { name: 'Home', icon: '🏠', description: 'Furniture and home decor', count: 22 },
    { name: 'Sports', icon: '⚽', description: 'Sports equipment and memorabilia', count: 16 }
  ];

  const categoryItems = {
    'Jewelry': [
      { id: 1, title: 'Vintage Rolex Watch', price: 2500, image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=300&h=200&fit=crop' },
      { id: 2, title: 'Diamond Engagement Ring', price: 1800, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=200&fit=crop' }
    ],
    'Electronics': [
      { id: 3, title: 'MacBook Pro 2023', price: 2200, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop' },
      { id: 4, title: 'iPhone 15 Pro', price: 1200, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop' }
    ],
    'Art': [
      { id: 5, title: 'Antique Persian Rug', price: 1800, image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&h=200&fit=crop' },
      { id: 6, title: 'Modern Art Painting', price: 950, image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=300&h=200&fit=crop' }
    ]
  };

  const displayedItems = selectedCategory === 'All' ? [] : (categoryItems[selectedCategory] || []);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="fw-bold mb-4">Browse Categories</h1>
          <p className="lead text-muted mb-5">Discover amazing items across different categories</p>

          {/* Categories Grid */}
          <div className="row g-4 mb-5">
            {categories.map((category, index) => (
              <div key={index} className="col-md-3 col-6">
                <div 
                  className={'text-center p-4 category-item border rounded-3 ' + (selectedCategory === category.name ? 'category-active' : '')}
                  onClick={() => setSelectedCategory(category.name)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="display-4 mb-3">{category.icon}</div>
                  <h5 className="fw-bold">{category.name}</h5>
                  <p className="text-muted small mb-2">{category.description}</p>
                  <span className="badge bg-primary">{category.count} items</span>
                </div>
              </div>
            ))}
          </div>

          {/* Category Items */}
          {selectedCategory !== 'All' && (
            <div className="row">
              <div className="col-12">
                <h2 className="fw-bold mb-4">{selectedCategory} Items</h2>
                <div className="row g-4">
                  {displayedItems.map(item => (
                    <div key={item.id} className="col-md-6 col-lg-3">
                      <div className="card h-100 shadow-sm border-0">
                        <img 
                          src={item.image} 
                          className="card-img-top" 
                          alt={item.title}
                          style={{ height: '150px', objectFit: 'cover' }}
                        />
                        <div className="card-body">
                          <h6 className="card-title fw-bold">{item.title}</h6>
                          <p className="card-text text-primary fw-bold"></p>
                          <Link to={'/auction/' + item.id} className="btn btn-outline-primary btn-sm w-100">
                            View Auction
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;

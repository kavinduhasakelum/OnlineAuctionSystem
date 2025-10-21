import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../api/api';

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuctions();
  }, []);

  useEffect(() => {
    filterAuctions();
  }, [auctions, searchTerm, category]);

  const fetchAuctions = async () => {
     try {
    const res = await api.get("/AuctionsApi"); // replace with your backend endpoint
    setAuctions(res.data); // use data from backend
    setLoading(false);
  } catch (error) {
    console.error('Error fetching auctions:', error.response?.data || error.message);
    setLoading(false);
  }
  };

  const filterAuctions = () => {
    let filtered = auctions;

    if (searchTerm) {
      filtered = filtered.filter(auction =>
        auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(auction => auction.category === category);
    }

    setFilteredAuctions(filtered);
  };

  const categories = ['Art', 'Electronics', 'Jewelry', 'Collectibles', 'Vehicles', 'Other'];

  if (loading) {
    return (
      <Container>
        <div className="loading-spinner">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Live Auctions</h1>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6}>
          <Form.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Auction Grid */}
      <Row>
        {filteredAuctions.map(auction => (
          <Col md={6} lg={4} key={auction.id} className="mb-4">
            <Card className="h-100 auction-card">
              <Card.Img 
                variant="top" 
                src={auction.imageUrl}
                style={{ height: '250px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{auction.title}</Card.Title>
                <Card.Text className="flex-grow-1">
                  {auction.description.substring(0, 100)}...
                </Card.Text>
                <div className="mt-auto">
                  <Card.Text>
                    <strong>Current Bid: </strong>
                  </Card.Text>
                  <Card.Text>
                    <small className="text-muted">
                      Category: {auction.category}
                    </small>
                  </Card.Text>
                  <Card.Text>
                    <small className="text-muted">
                      Ends: {new Date(auction.endTime).toLocaleString()}
                    </small>
                  </Card.Text>
                  <Button 
                    as={Link} 
                    to={`/auctions/${auction.id}`} 
                    variant="primary" 
                    className="w-100"
                  >
                    View Details & Bid
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredAuctions.length === 0 && (
        <Row>
          <Col className="text-center">
            <h3>No auctions found</h3>
            <p>Try adjusting your search criteria</p>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AuctionList;

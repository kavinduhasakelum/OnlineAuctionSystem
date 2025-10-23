import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import { getImageUrl } from "../../utils/imageHelper";

const BuyerHome = () => {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("endingSoon"); // endingSoon, newest, priceLow, priceHigh

  useEffect(() => {
    fetchActiveAuctions();
  }, []);

  useEffect(() => {
    filterAndSortAuctions();
  }, [auctions, searchTerm, sortBy]);

  const fetchActiveAuctions = async () => {
    try {
      setLoading(true);
      // Use 'approved' endpoint to get all approved products including future ones
      const response = await api.get("/ProductsApi/approved?limit=100");
      setAuctions(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching auctions:", error);
      setError("Failed to load auctions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortAuctions = () => {
    let filtered = [...auctions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(auction =>
        auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case "endingSoon":
        filtered.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "priceLow":
        filtered.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case "priceHigh":
        filtered.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      default:
        break;
    }

    setFilteredAuctions(filtered);
  };

  const getPrimaryImage = (product) => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
      return getImageUrl(primaryImage.imageUrl);
    }
    return getImageUrl(null);
  };

  const getAuctionStatus = (auction) => {
    const now = new Date();
    const start = new Date(auction.startTime);
    const end = new Date(auction.endTime);

    if (now < start) {
      return { text: "Upcoming", badge: "info", canBid: false };
    } else if (now >= start && now < end) {
      return { text: "Active", badge: "success", canBid: true };
    } else {
      return { text: "Ended", badge: "secondary", canBid: false };
    }
  };

  const getTimeRemaining = (auction) => {
    const now = new Date();
    const start = new Date(auction.startTime);
    const end = new Date(auction.endTime);

    // If not started yet
    if (now < start) {
      const diff = start - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (days > 0) return `Starts in ${days}d ${hours}h`;
      if (hours > 0) return `Starts in ${hours}h`;
      return `Starts soon`;
    }

    // If active
    const diff = end - now;
    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading active auctions...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="mb-4">
        <h2 className="mb-3">
          <i className="bi bi-hammer me-2"></i>
          Active Auctions
        </h2>
        
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Search and Filter Controls */}
        <Row className="mb-4">
          <Col md={8}>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search auctions by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={4}>
            <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="endingSoon">Ending Soon</option>
              <option value="newest">Newest First</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Summary */}
        <Alert variant="info">
          <strong>{filteredAuctions.length}</strong> active auction{filteredAuctions.length !== 1 ? 's' : ''} available
        </Alert>
      </div>

      {/* Auctions Grid */}
      {filteredAuctions.length === 0 ? (
        <Alert variant="warning">
          <i className="bi bi-info-circle me-2"></i>
          No active auctions found. {searchTerm && "Try adjusting your search."}
        </Alert>
      ) : (
        <Row>
          {filteredAuctions.map((auction) => (
            <Col key={auction.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm hover-shadow-lg" style={{ transition: "all 0.3s" }}>
                {/* Product Image */}
                <div style={{ height: "200px", overflow: "hidden", backgroundColor: "#f8f9fa" }}>
                  <Card.Img
                    variant="top"
                    src={getPrimaryImage(auction)}
                    alt={auction.name}
                    style={{ height: "100%", width: "100%", objectFit: "cover" }}
                  />
                </div>

                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-truncate" title={auction.name}>
                    {auction.name}
                  </Card.Title>
                  
                  <Card.Text className="text-muted small text-truncate" style={{ minHeight: "40px" }}>
                    {auction.description || "No description available"}
                  </Card.Text>

                  {/* Price Info */}
                  <div className="mb-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted">Current Bid:</small>
                      <Badge bg="success" className="fs-6">
                        ${auction.currentPrice.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">Starting Price:</small>
                      <small>${auction.startPrice.toFixed(2)}</small>
                    </div>
                  </div>

                  {/* Auction Status */}
                  <div className="mb-2">
                    <Badge bg={getAuctionStatus(auction).badge} className="me-2">
                      {getAuctionStatus(auction).text}
                    </Badge>
                  </div>

                  {/* Time Remaining */}
                  <div className="mb-3">
                    <Badge bg="warning" text="dark" className="w-100">
                      <i className="bi bi-clock me-1"></i>
                      {getTimeRemaining(auction)}
                    </Badge>
                  </div>

                  {/* Action Button */}
                  <Link to={`/buyer/auction/${auction.id}`} className="mt-auto">
                    <Button 
                      variant={getAuctionStatus(auction).canBid ? "primary" : "outline-secondary"} 
                      className="w-100"
                    >
                      <i className="bi bi-eye me-2"></i>
                      {getAuctionStatus(auction).canBid ? "View & Bid" : "View Details"}
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Quick Links */}
      <Row className="mt-5">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>
                <i className="bi bi-lightbulb me-2"></i>
                Quick Actions
              </h5>
              <div className="d-flex gap-3 flex-wrap mt-3">
                <Link to="/buyer/my-bids">
                  <Button variant="outline-primary">
                    <i className="bi bi-list-check me-2"></i>
                    My Bids
                  </Button>
                </Link>
                <Button variant="outline-secondary" onClick={fetchActiveAuctions}>
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Refresh Auctions
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BuyerHome;

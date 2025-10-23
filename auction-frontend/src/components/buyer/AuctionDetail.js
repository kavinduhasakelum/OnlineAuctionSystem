import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  Spinner,
  Form,
  InputGroup,
  Table,
  Modal,
} from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import { getImageUrl } from "../../utils/imageHelper";

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBidModal, setShowBidModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchAuctionDetails();
    fetchBids();
  }, [id]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchAuctionDetails();
      fetchBids();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [id, autoRefresh]);

  const fetchAuctionDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/ProductsApi/${id}`);
      setAuction(response.data);
      
      // Set default bid amount to current price + min increment
      if (response.data) {
        const minBid = response.data.currentPrice + response.data.minBidIncrement;
        setBidAmount(minBid.toFixed(2));
      }
      
      setError("");
    } catch (error) {
      console.error("Error fetching auction details:", error);
      setError("Failed to load auction details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await api.get(`/BidsApi/product/${id}?limit=20`);
      setBids(response.data);
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("You must be logged in to place a bid.");
      return;
    }

    const amount = parseFloat(bidAmount);
    const minBid = auction.currentPrice + auction.minBidIncrement;

    if (amount < minBid) {
      setError(`Bid must be at least $${minBid.toFixed(2)}`);
      return;
    }

    try {
      setSubmitting(true);
      
      const bidData = {
        productId: parseInt(id),
        buyerId: user.id,
        bidAmount: parseFloat(amount)
      };
      
      console.log("Submitting bid:", bidData);
      
      const response = await api.post("/BidsApi", bidData);

      setSuccess(`Bid of $${amount.toFixed(2)} placed successfully!`);
      setShowBidModal(false);
      
      // Refresh data
      await fetchAuctionDetails();
      await fetchBids();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    } catch (error) {
      console.error("Error placing bid:", error);
      console.error("Error response:", error.response);
      
      let errorMessage = "Failed to place bid. Please try again.";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.title) {
          errorMessage = error.response.data.title;
        }
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return { text: "Auction Ended", variant: "danger" };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 1) {
      return { text: `${days} days ${hours} hours`, variant: "success" };
    } else if (days === 1) {
      return { text: `${days} day ${hours} hours`, variant: "warning" };
    } else if (hours > 1) {
      return { text: `${hours} hours ${minutes} minutes`, variant: "warning" };
    } else {
      return { text: `${minutes}m ${seconds}s`, variant: "danger" };
    }
  };

  const isAuctionActive = () => {
    if (!auction) return false;
    const now = new Date();
    return new Date(auction.startTime) <= now && new Date(auction.endTime) > now;
  };

  const canBid = () => {
    if (!auction || !user) return false;
    if (auction.sellerId === user.id) return false; // Can't bid on own auction
    return isAuctionActive();
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading auction details...</p>
      </Container>
    );
  }

  if (!auction) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Auction not found.</Alert>
        <Button onClick={() => navigate("/buyer")}>Back to Auctions</Button>
      </Container>
    );
  }

  const timeRemaining = getTimeRemaining(auction.endTime);
  const highestBid = bids.length > 0 ? bids[0] : null;
  const userIsHighestBidder = highestBid && user && highestBid.buyerId === user.id;

  return (
    <Container fluid className="py-4">
      <Button variant="outline-secondary" className="mb-3" onClick={() => navigate("/buyer")}>
        <i className="bi bi-arrow-left me-2"></i>
        Back to Auctions
      </Button>

      {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}

      <Row>
        {/* Left Column - Images */}
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              {/* Main Image */}
              {auction.images && auction.images.length > 0 ? (
                <>
                  <div className="mb-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                    <img
                      src={getImageUrl(auction.images[selectedImage]?.imageUrl)}
                      alt={auction.name}
                      className="w-100"
                      style={{ maxHeight: "500px", objectFit: "contain" }}
                    />
                  </div>

                  {/* Thumbnail Gallery */}
                  {auction.images.length > 1 && (
                    <Row>
                      {auction.images.map((image, index) => (
                        <Col xs={3} key={image.id} className="mb-2">
                          <img
                            src={getImageUrl(image.imageUrl)}
                            alt={`${auction.name} ${index + 1}`}
                            className={`w-100 ${selectedImage === index ? 'border border-primary border-3' : ''}`}
                            style={{
                              height: "80px",
                              objectFit: "cover",
                              cursor: "pointer",
                              borderRadius: "4px",
                            }}
                            onClick={() => setSelectedImage(index)}
                          />
                        </Col>
                      ))}
                    </Row>
                  )}
                </>
              ) : (
                <div className="text-center py-5" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                  <i className="bi bi-image" style={{ fontSize: "4rem", color: "#ccc" }}></i>
                  <p className="text-muted mt-2">No images available</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column - Details & Bidding */}
        <Col md={6}>
          {/* Auction Info */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="mb-3">{auction.name}</h2>
              
              {/* Status Badges */}
              <div className="mb-3">
                <Badge bg={timeRemaining.variant} className="me-2">
                  <i className="bi bi-clock me-1"></i>
                  {timeRemaining.text}
                </Badge>
                {userIsHighestBidder && (
                  <Badge bg="success">
                    <i className="bi bi-trophy me-1"></i>
                    You're winning!
                  </Badge>
                )}
              </div>

              {/* Current Price */}
              <Card className="bg-light mb-3">
                <Card.Body>
                  <Row>
                    <Col>
                      <small className="text-muted d-block">Current Bid</small>
                      <h3 className="mb-0 text-success">${auction.currentPrice.toFixed(2)}</h3>
                    </Col>
                    <Col>
                      <small className="text-muted d-block">Starting Price</small>
                      <h5 className="mb-0">${auction.startPrice.toFixed(2)}</h5>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col>
                      <small className="text-muted d-block">Min. Bid Increment</small>
                      <span>${auction.minBidIncrement.toFixed(2)}</span>
                    </Col>
                    <Col>
                      <small className="text-muted d-block">Total Bids</small>
                      <span>{bids.length}</span>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Bid Button */}
              {canBid() ? (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-100 mb-3"
                  onClick={() => setShowBidModal(true)}
                >
                  <i className="bi bi-hammer me-2"></i>
                  Place Bid
                </Button>
              ) : (
                <Alert variant="warning">
                  {!user && "You must be logged in to bid."}
                  {user && auction.sellerId === user.id && "You cannot bid on your own auction."}
                  {user && auction.sellerId !== user.id && !isAuctionActive() && "This auction is not active."}
                </Alert>
              )}

              {/* Description */}
              <div className="mb-3">
                <h5>Description</h5>
                <p className="text-muted">{auction.description || "No description provided."}</p>
              </div>

              {/* Seller Info */}
              <div>
                <h6 className="text-muted">Seller Information</h6>
                <p className="mb-1">
                  <strong>Name:</strong> {auction.seller?.fullName || "N/A"}
                </p>
                <p className="mb-0">
                  <strong>Email:</strong> {auction.seller?.email || "N/A"}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bid History */}
      <Row>
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-list-ul me-2"></i>
                Bid History
              </h5>
              <Form.Check
                type="switch"
                id="auto-refresh"
                label="Auto Refresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
            </Card.Header>
            <Card.Body>
              {bids.length === 0 ? (
                <Alert variant="info" className="mb-0">
                  No bids yet. Be the first to bid!
                </Alert>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Bidder</th>
                      <th>Amount</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.map((bid, index) => (
                      <tr key={bid.id} className={index === 0 ? 'table-success' : ''}>
                        <td>{index + 1}</td>
                        <td>
                          {bid.buyer?.fullName || "Anonymous"}
                          {user && bid.buyerId === user.id && (
                            <Badge bg="info" className="ms-2">You</Badge>
                          )}
                        </td>
                        <td>
                          <strong>${bid.bidAmount.toFixed(2)}</strong>
                        </td>
                        <td>{new Date(bid.createdAt).toLocaleString()}</td>
                        <td>
                          {index === 0 ? (
                            <Badge bg="success">Highest Bid</Badge>
                          ) : (
                            <Badge bg="secondary">Outbid</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bid Modal */}
      <Modal show={showBidModal} onHide={() => setShowBidModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Place Your Bid</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePlaceBid}>
          <Modal.Body>
            <Alert variant="info">
              <strong>Current Bid:</strong> ${auction.currentPrice.toFixed(2)}<br />
              <strong>Minimum Bid:</strong> ${(auction.currentPrice + auction.minBidIncrement).toFixed(2)}
            </Alert>

            <Form.Group className="mb-3">
              <Form.Label>Your Bid Amount</Form.Label>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  step="0.01"
                  min={(auction.currentPrice + auction.minBidIncrement).toFixed(2)}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter bid amount"
                  required
                  disabled={submitting}
                />
              </InputGroup>
              <Form.Text className="text-muted">
                Must be at least ${(auction.currentPrice + auction.minBidIncrement).toFixed(2)}
              </Form.Text>
            </Form.Group>

            {/* Quick bid buttons */}
            <div className="d-flex gap-2 flex-wrap">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setBidAmount((auction.currentPrice + auction.minBidIncrement).toFixed(2))}
              >
                Min: ${(auction.currentPrice + auction.minBidIncrement).toFixed(2)}
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setBidAmount((auction.currentPrice + auction.minBidIncrement * 2).toFixed(2))}
              >
                +2x: ${(auction.currentPrice + auction.minBidIncrement * 2).toFixed(2)}
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setBidAmount((auction.currentPrice + auction.minBidIncrement * 5).toFixed(2))}
              >
                +5x: ${(auction.currentPrice + auction.minBidIncrement * 5).toFixed(2)}
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowBidModal(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Placing Bid...
                </>
              ) : (
                <>
                  <i className="bi bi-hammer me-2"></i>
                  Confirm Bid
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AuctionDetail;

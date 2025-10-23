import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Table, Tabs, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import { getImageUrl } from "../../utils/imageHelper";

const MyBids = () => {
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (user) {
      fetchMyBids();
    }
  }, [user]);

  const fetchMyBids = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/BidsApi/buyer/${user.id}?limit=100`);
      setBids(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching bids:", error);
      setError("Failed to load your bids.");
    } finally {
      setLoading(false);
    }
  };

  const getProductStatus = (product) => {
    const now = new Date();
    const startTime = new Date(product.startTime);
    const endTime = new Date(product.endTime);

    if (now < startTime) return { text: "Not Started", variant: "secondary" };
    if (now > endTime) return { text: "Ended", variant: "danger" };
    return { text: "Active", variant: "success" };
  };

  const isWinning = (bid) => {
    return bid.bidAmount >= bid.product.currentPrice;
  };

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const getPrimaryImage = (product) => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
      return getImageUrl(primaryImage.imageUrl);
    }
    return getImageUrl(null);
  };

  // Filter bids by status
  const getFilteredBids = () => {
    const now = new Date();
    
    switch (activeTab) {
      case "winning":
        return bids.filter(bid => {
          const status = getProductStatus(bid.product);
          return status.text === "Active" && isWinning(bid);
        });
      case "outbid":
        return bids.filter(bid => {
          const status = getProductStatus(bid.product);
          return status.text === "Active" && !isWinning(bid);
        });
      case "won":
        return bids.filter(bid => {
          const status = getProductStatus(bid.product);
          return status.text === "Ended" && isWinning(bid);
        });
      case "lost":
        return bids.filter(bid => {
          const status = getProductStatus(bid.product);
          return status.text === "Ended" && !isWinning(bid);
        });
      default:
        return bids;
    }
  };

  // Group bids by product (get highest bid per product)
  const getGroupedBids = () => {
    const grouped = {};
    bids.forEach(bid => {
      if (!grouped[bid.productId] || bid.bidAmount > grouped[bid.productId].bidAmount) {
        grouped[bid.productId] = bid;
      }
    });
    return Object.values(grouped);
  };

  const filteredBids = getFilteredBids();
  const groupedBids = getGroupedBids();

  // Statistics
  const stats = {
    total: groupedBids.length,
    winning: groupedBids.filter(bid => {
      const status = getProductStatus(bid.product);
      return status.text === "Active" && isWinning(bid);
    }).length,
    outbid: groupedBids.filter(bid => {
      const status = getProductStatus(bid.product);
      return status.text === "Active" && !isWinning(bid);
    }).length,
    won: groupedBids.filter(bid => {
      const status = getProductStatus(bid.product);
      return status.text === "Ended" && isWinning(bid);
    }).length,
    lost: groupedBids.filter(bid => {
      const status = getProductStatus(bid.product);
      return status.text === "Ended" && !isWinning(bid);
    }).length,
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your bids...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-list-check me-2"></i>
          My Bids
        </h2>
        <Button variant="outline-primary" onClick={fetchMyBids}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col xs={6} md={2}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h3 className="mb-0">{stats.total}</h3>
              <small className="text-muted">Total Auctions</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={2}>
          <Card className="text-center shadow-sm border-success">
            <Card.Body>
              <h3 className="mb-0 text-success">{stats.winning}</h3>
              <small className="text-muted">Winning</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={2}>
          <Card className="text-center shadow-sm border-warning">
            <Card.Body>
              <h3 className="mb-0 text-warning">{stats.outbid}</h3>
              <small className="text-muted">Outbid</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={2}>
          <Card className="text-center shadow-sm border-primary">
            <Card.Body>
              <h3 className="mb-0 text-primary">{stats.won}</h3>
              <small className="text-muted">Won</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={2}>
          <Card className="text-center shadow-sm border-danger">
            <Card.Body>
              <h3 className="mb-0 text-danger">{stats.lost}</h3>
              <small className="text-muted">Lost</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bids List */}
      <Card className="shadow-sm">
        <Card.Body>
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
            <Tab eventKey="all" title={`All (${bids.length})`}>
              {/* Content rendered below */}
            </Tab>
            <Tab eventKey="winning" title={`Winning (${stats.winning})`}>
              {/* Content rendered below */}
            </Tab>
            <Tab eventKey="outbid" title={`Outbid (${stats.outbid})`}>
              {/* Content rendered below */}
            </Tab>
            <Tab eventKey="won" title={`Won (${stats.won})`}>
              {/* Content rendered below */}
            </Tab>
            <Tab eventKey="lost" title={`Lost (${stats.lost})`}>
              {/* Content rendered below */}
            </Tab>
          </Tabs>

          {filteredBids.length === 0 ? (
            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              {activeTab === "all" ? "You haven't placed any bids yet." : `No ${activeTab} bids found.`}
              <br />
              <Link to="/buyer" className="alert-link">Browse active auctions</Link> to start bidding!
            </Alert>
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Your Bid</th>
                  <th>Current Price</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBids.map((bid) => {
                  const status = getProductStatus(bid.product);
                  const winning = isWinning(bid);
                  
                  return (
                    <tr key={bid.id} className={winning && status.text === "Active" ? "table-success" : ""}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={getPrimaryImage(bid.product)}
                            alt={bid.product.name}
                            style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
                            className="me-3"
                          />
                          <div>
                            <strong>{bid.product.name}</strong>
                            <br />
                            <small className="text-muted">
                              Bid placed: {new Date(bid.createdAt).toLocaleString()}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>${bid.bidAmount.toFixed(2)}</strong>
                      </td>
                      <td>
                        <strong className="text-success">${bid.product.currentPrice.toFixed(2)}</strong>
                      </td>
                      <td>
                        <Badge bg={status.variant} className="mb-1">
                          {status.text}
                        </Badge>
                        <br />
                        {status.text === "Active" && (
                          <Badge bg={winning ? "success" : "warning"}>
                            {winning ? "Winning" : "Outbid"}
                          </Badge>
                        )}
                        {status.text === "Ended" && (
                          <Badge bg={winning ? "primary" : "secondary"}>
                            {winning ? "Won" : "Lost"}
                          </Badge>
                        )}
                      </td>
                      <td>
                        <small>{getTimeRemaining(bid.product.endTime)}</small>
                      </td>
                      <td>
                        <Link to={`/buyer/auction/${bid.productId}`}>
                          <Button variant="outline-primary" size="sm">
                            <i className="bi bi-eye me-1"></i>
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MyBids;

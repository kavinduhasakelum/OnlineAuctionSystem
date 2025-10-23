import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../../api/api";

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuickStats();
  }, []);

  const fetchQuickStats = async () => {
    try {
      const response = await api.get("/AdminApi/dashboard/stats");
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch quick stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-2">Admin Panel 🛠️</h2>
      <p className="text-center text-muted mb-4">
        Manage users, monitor auctions, and oversee the platform efficiently.
      </p>

      {/* Quick Stats */}
      {loading ? (
        <div className="text-center py-3 mb-4">
          <Spinner animation="border" size="sm" />
        </div>
      ) : stats ? (
        <>
          {/* Alert for pending approvals */}
          {stats.overview.pendingProducts > 0 && (
            <Alert variant="warning" className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <strong>⚠️ Action Required:</strong> {stats.overview.pendingProducts} product(s) pending approval.
              </div>
              <Button as={Link} to="/admin/auctions" variant="warning" size="sm">
                Review Now
              </Button>
            </Alert>
          )}

          {/* Quick Stats Cards */}
          <Row className="mb-4">
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center shadow-sm border-0">
                <Card.Body>
                  <h2 className="text-primary mb-1">{stats.overview.totalUsers}</h2>
                  <p className="text-muted mb-0">Total Users</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center shadow-sm border-0">
                <Card.Body>
                  <h2 className="text-success mb-1">{stats.overview.activeAuctions}</h2>
                  <p className="text-muted mb-0">Active Auctions</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center shadow-sm border-0">
                <Card.Body>
                  <h2 className="text-warning mb-1">{stats.overview.pendingProducts}</h2>
                  <p className="text-muted mb-0">Pending Approval</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center shadow-sm border-0">
                <Card.Body>
                  <h2 className="text-info mb-1">{stats.overview.totalBids}</h2>
                  <p className="text-muted mb-0">Total Bids</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : null}

      {/* Main Action Cards */}
      <h4 className="mb-3">Quick Actions</h4>
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="shadow-sm h-100 border-0" style={{ borderLeft: "4px solid #0d6efd" }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="fs-1 me-3">👥</div>
                <div>
                  <Card.Title className="mb-1">Manage Users</Card.Title>
                  <Card.Text className="text-muted small mb-0">
                    View, edit, or remove user accounts
                  </Card.Text>
                </div>
              </div>
              <ul className="small mb-3">
                <li>View all registered users</li>
                <li>Change user roles</li>
                <li>Delete user accounts</li>
                <li>View user statistics</li>
              </ul>
              <Button as={Link} to="/admin/users" variant="primary" className="w-100">
                Go to Users
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="shadow-sm h-100 border-0" style={{ borderLeft: "4px solid #198754" }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="fs-1 me-3">🏷️</div>
                <div>
                  <Card.Title className="mb-1">Manage Auctions</Card.Title>
                  <Card.Text className="text-muted small mb-0">
                    Approve or monitor auction listings
                  </Card.Text>
                </div>
              </div>
              <ul className="small mb-3">
                <li>Approve pending products</li>
                <li>Reject inappropriate listings</li>
                <li>Delete products</li>
                <li>Monitor all auctions</li>
              </ul>
              <Button as={Link} to="/admin/auctions" variant="success" className="w-100">
                Manage Auctions
                {stats && stats.overview.pendingProducts > 0 && (
                  <Badge bg="warning" className="ms-2">
                    {stats.overview.pendingProducts}
                  </Badge>
                )}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="shadow-sm h-100 border-0" style={{ borderLeft: "4px solid #0dcaf0" }}>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="fs-1 me-3">📊</div>
                <div>
                  <Card.Title className="mb-1">System Dashboard</Card.Title>
                  <Card.Text className="text-muted small mb-0">
                    View platform analytics and insights
                  </Card.Text>
                </div>
              </div>
              <ul className="small mb-3">
                <li>Overview statistics</li>
                <li>Users by role breakdown</li>
                <li>Products by status</li>
                <li>Recent activity</li>
              </ul>
              <Button as={Link} to="/admin/dashboard" variant="info" className="w-100">
                View Dashboard
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      {stats && (
        <Row>
          <Col md={6} className="mb-3">
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-light">
                <h6 className="mb-0">📋 Recent Users</h6>
              </Card.Header>
              <Card.Body>
                {stats.recentUsers && stats.recentUsers.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {stats.recentUsers.slice(0, 3).map((user) => (
                      <div key={user.id} className="list-group-item border-0 px-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{user.firstName} {user.lastName}</strong>
                            <br />
                            <small className="text-muted">{user.email}</small>
                          </div>
                          <Badge bg={user.role === "Admin" ? "danger" : user.role === "Seller" ? "primary" : "success"}>
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted mb-0">No recent users</p>
                )}
                <div className="text-center mt-2">
                  <Link to="/admin/users" className="text-decoration-none small">
                    View All Users →
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-3">
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-light">
                <h6 className="mb-0">🏷️ Recent Products</h6>
              </Card.Header>
              <Card.Body>
                {stats.recentProducts && stats.recentProducts.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {stats.recentProducts.slice(0, 3).map((product) => (
                      <div key={product.id} className="list-group-item border-0 px-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{product.name}</strong>
                            <br />
                            <small className="text-muted">
                              by {product.seller.firstName} {product.seller.lastName}
                            </small>
                          </div>
                          <div className="text-end">
                            <Badge bg={product.status === "Active" ? "success" : product.status === "Pending" ? "warning" : "secondary"}>
                              {product.status}
                            </Badge>
                            {!product.isApproved && (
                              <Badge bg="danger" className="ms-1">Pending</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted mb-0">No recent products</p>
                )}
                <div className="text-center mt-2">
                  <Link to="/admin/auctions" className="text-decoration-none small">
                    View All Products →
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AdminHome;
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";
import api from "../../api/api";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/AdminApi/dashboard/stats");
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "Admin":
        return "danger";
      case "Seller":
        return "primary";
      case "Buyer":
        return "success";
      default:
        return "secondary";
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Pending":
        return "warning";
      case "Sold":
        return "info";
      case "Expired":
        return "secondary";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading dashboard statistics...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">System Dashboard</h2>

      {/* Overview Statistics */}
      <h4 className="mb-3">Overview</h4>
      <Row className="mb-4">
        <Col md={4} lg={2} className="mb-3">
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <h3 className="text-primary">{stats.overview.totalUsers}</h3>
              <p className="mb-0 text-muted">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={2} className="mb-3">
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <h3 className="text-info">{stats.overview.totalProducts}</h3>
              <p className="mb-0 text-muted">Total Products</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={3} className="mb-3">
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <h3 className="text-warning">{stats.overview.pendingProducts}</h3>
              <p className="mb-0 text-muted">Pending Approval</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={2} className="mb-3">
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <h3 className="text-success">{stats.overview.activeAuctions}</h3>
              <p className="mb-0 text-muted">Active Auctions</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={3} className="mb-3">
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <h3 className="text-secondary">{stats.overview.totalBids}</h3>
              <p className="mb-0 text-muted">Total Bids</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Users by Role */}
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Users by Role</h5>
            </Card.Header>
            <Card.Body>
              {stats.usersByRole && stats.usersByRole.length > 0 ? (
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th className="text-end">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.usersByRole.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <Badge bg={getRoleBadgeVariant(item.role)}>
                            {item.role}
                          </Badge>
                        </td>
                        <td className="text-end">
                          <strong>{item.count}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted mb-0">No data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Products by Status */}
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Products by Status</h5>
            </Card.Header>
            <Card.Body>
              {stats.productsByStatus && stats.productsByStatus.length > 0 ? (
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th className="text-end">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.productsByStatus.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <Badge bg={getStatusBadgeVariant(item.status)}>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="text-end">
                          <strong>{item.count}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted mb-0">No data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Recent Users */}
        <Col lg={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">Recent Users</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {stats.recentUsers && stats.recentUsers.length > 0 ? (
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.firstName} {user.lastName}</td>
                        <td><small>{user.email}</small></td>
                        <td>
                          <Badge bg={getRoleBadgeVariant(user.role)} size="sm">
                            {user.role}
                          </Badge>
                        </td>
                        <td>
                          <small>{new Date(user.createdAt).toLocaleDateString()}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted p-3 mb-0">No recent users</p>
              )}
              <Card.Footer className="text-center">
                <Link to="/admin/users">View All Users →</Link>
              </Card.Footer>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Products */}
        <Col lg={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">Recent Products</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {stats.recentProducts && stats.recentProducts.length > 0 ? (
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Seller</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <strong>{product.name}</strong>
                          {!product.isApproved && (
                            <Badge bg="danger" className="ms-2" size="sm">
                              Needs Approval
                            </Badge>
                          )}
                        </td>
                        <td>
                          <small>
                            {product.seller.firstName} {product.seller.lastName}
                          </small>
                        </td>
                        <td>
                          <Badge bg={getStatusBadgeVariant(product.status)} size="sm">
                            {product.status}
                          </Badge>
                        </td>
                        <td>
                          <small>{new Date(product.createdAt).toLocaleDateString()}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted p-3 mb-0">No recent products</p>
              )}
              <Card.Footer className="text-center">
                <Link to="/admin/auctions">View All Products →</Link>
              </Card.Footer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      {stats.overview.pendingProducts > 0 && (
        <Alert variant="warning" className="d-flex justify-content-between align-items-center">
          <div>
            <strong>⚠️ Action Required:</strong> You have {stats.overview.pendingProducts} product(s) pending approval.
          </div>
          <Link to="/admin/auctions" className="btn btn-warning btn-sm">
            Review Now
          </Link>
        </Alert>
      )}
    </Container>
  );
};

export default AdminDashboard;

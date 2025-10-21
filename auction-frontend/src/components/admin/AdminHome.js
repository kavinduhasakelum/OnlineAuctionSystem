import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const AdminHome = () => {
  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Admin Panel 🛠️</h2>
      <p className="text-center text-muted mb-5">
        Manage users, monitor auctions, and oversee the platform efficiently.
      </p>

      <Row>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Manage Users</Card.Title>
              <Card.Text>View, edit, or remove user accounts.</Card.Text>
              <Button as={Link} to="/admin/users" variant="primary" className="w-100">
                Go to Users
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Manage Auctions</Card.Title>
              <Card.Text>Approve or monitor auction listings.</Card.Text>
              <Button as={Link} to="/admin/auctions" variant="success" className="w-100">
                Manage Auctions
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>System Dashboard</Card.Title>
              <Card.Text>View platform analytics and logs.</Card.Text>
              <Button as={Link} to="/admin/dashboard" variant="info" className="w-100">
                View Dashboard
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminHome;
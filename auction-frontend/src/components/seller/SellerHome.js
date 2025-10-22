import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const SellerHome = () => {
    return (
        <Container className="mt-4">
        <h2 className="text-center mb-4">Welcome, Seller 🧾</h2>
        <p className="text-center text-muted mb-5">
            Manage your products, monitor bids, and engage with buyers.
        </p>

        <Row>
            <Col md={4}>
            <Card className="shadow-sm">
                <Card.Body>
                <Card.Title>Create Product</Card.Title>
                <Card.Text>List a new item for product quickly.</Card.Text>
                <Button as={Link} to="/create-auction" variant="success" className="w-100">
                    Create Product
                </Button>
                </Card.Body>
            </Card>
            </Col>

            {/* <Col md={4}>
            <Card className="shadow-sm">
                <Card.Body>
                <Card.Title>My Dashboard</Card.Title>
                <Card.Text>View and manage your active auctions.</Card.Text>
                <Button as={Link} to="/seller/dashboard" variant="primary" className="w-100">
                    Go to Dashboard
                </Button>
                </Card.Body>
            </Card>
            </Col> */}

            <Col md={4}>
            <Card className="shadow-sm">
                <Card.Body>
                <Card.Title>My Profile</Card.Title>
                <Card.Text>View your personal and seller details.</Card.Text>
                <Button as={Link} to="/profile" variant="info" className="w-100">
                    View Profile
                </Button>
                </Card.Body>
            </Card>
            </Col>
        </Row>
        <div>
            <h1>My products</h1>
        </div>
        </Container>
    );
};

export default SellerHome;
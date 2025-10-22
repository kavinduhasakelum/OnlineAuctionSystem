import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const SellerHome = () => {
    // Dummy product data for demonstration
    const [products, setProducts] = useState([
        {
            id: 'p1',
            name: 'Vintage Leather Bag',
            imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop', // Placeholder image
            description: 'A beautifully preserved vintage leather bag.',
        },
        {
            id: 'p2',
            name: 'Handmade Ceramic Mug',
            imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop', // Placeholder image
            description: 'Unique, handcrafted ceramic mug.',
        },
        {
            id: 'p3',
            name: 'Artisanal Silver Necklace',
            imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop', // Placeholder image
            description: 'Elegant necklace with a delicate design.',
        },
    ]);

    // In a real application, you would fetch products from an API here
    useEffect(() => {
        // Simulate an API call
        // fetch('/api/seller/products')
        //   .then(response => response.json())
        //   .then(data => setProducts(data))
        //   .catch(error => console.error('Error fetching products:', error));
    }, []);

    return (
        <Container className="mt-4">
        <h2 className="text-center mb-4">Welcome, Seller 🧾</h2>
        <p className="text-center text-muted mb-5">
            Manage your products, monitor bids, and engage with buyers.
        </p>

        <Row className="mb-5"> {/* Added mb-5 for spacing */}
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

        <div className="mt-5"> {/* Added mt-5 for top margin */}
            <h1 className="mb-4">My Products</h1>
            <Row>
            {products.length > 0 ? (
                products.map((product) => (
                <Col key={product.id} md={4} className="mb-4">
                    <Card className="shadow-sm h-100">
                    <Card.Img variant="top" src={product.imageUrl} alt={product.name} style={{ height: '200px', objectFit: 'cover' }} />
                    <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>{product.description}</Card.Text>
                        {/* You can add more buttons here, e.g., Edit, View Details */}
                        <Button as={Link} to={`/product/${product.id}`} variant="outline-primary" size="sm">
                            View Details
                        </Button>
                    </Card.Body>
                    </Card>
                </Col>
                ))
            ) : (
                <Col>
                <p className="text-center text-muted">You haven't listed any products yet.</p>
                </Col>
            )}
            </Row>
        </div>
        </Container>
    );
};

export default SellerHome;
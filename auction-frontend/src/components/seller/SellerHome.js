import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { getImageUrl } from "../../utils/imageHelper";

const SellerHome = () => {
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        active: 0,
        sold: 0,
        expired: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await api.get("/ProductsApi/my-products");
            const productList = response.data;
            setProducts(productList);

            // Calculate stats
            setStats({
                total: productList.length,
                pending: productList.filter(p => !p.isApproved && p.status === "Pending").length,
                active: productList.filter(p => p.isApproved && p.status === "Active").length,
                sold: productList.filter(p => p.status === "Sold").length,
                expired: productList.filter(p => p.status === "Expired").length
            });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (product) => {
        if (!product.isApproved && product.status === "Pending") {
            return <Badge bg="warning">Pending Approval</Badge>;
        }
        switch (product.status) {
            case "Active":
                return <Badge bg="success">Active</Badge>;
            case "Sold":
                return <Badge bg="info">Sold</Badge>;
            case "Expired":
                return <Badge bg="secondary">Expired</Badge>;
            default:
                return <Badge bg="secondary">{product.status}</Badge>;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const getPrimaryImage = (product) => {
        if (product.images && product.images.length > 0) {
            const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
            return getImageUrl(primaryImage.imageUrl);
        }
        return getImageUrl(null);
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-2">Seller Dashboard 🏪</h2>
            <p className="text-center text-muted mb-4">
                Manage your products, monitor auctions, and track sales.
            </p>

            {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

            {/* Stats Cards */}
            <Row className="mb-4">
                <Col md={6} lg={2} className="mb-3">
                    <Card className="text-center shadow-sm border-0">
                        <Card.Body>
                            <h3 className="text-primary mb-1">{stats.total}</h3>
                            <p className="text-muted mb-0 small">Total Products</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={2} className="mb-3">
                    <Card className="text-center shadow-sm border-0">
                        <Card.Body>
                            <h3 className="text-warning mb-1">{stats.pending}</h3>
                            <p className="text-muted mb-0 small">Pending Approval</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={3} className="mb-3">
                    <Card className="text-center shadow-sm border-0">
                        <Card.Body>
                            <h3 className="text-success mb-1">{stats.active}</h3>
                            <p className="text-muted mb-0 small">Active Auctions</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={2} className="mb-3">
                    <Card className="text-center shadow-sm border-0">
                        <Card.Body>
                            <h3 className="text-info mb-1">{stats.sold}</h3>
                            <p className="text-muted mb-0 small">Sold</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={3} className="mb-3">
                    <Card className="text-center shadow-sm border-0">
                        <Card.Body>
                            <h3 className="text-secondary mb-1">{stats.expired}</h3>
                            <p className="text-muted mb-0 small">Expired</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Alert for pending products */}
            {stats.pending > 0 && (
                <Alert variant="warning" className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <strong>⏳ Awaiting Approval:</strong> You have {stats.pending} product(s) pending admin approval.
                    </div>
                </Alert>
            )}

            {/* Action Buttons */}
            <Row className="mb-4">
                <Col md={6} className="mb-3">
                    <Card className="shadow-sm h-100 border-0" style={{ borderLeft: "4px solid #198754" }}>
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <div className="fs-1 me-3">➕</div>
                                <div className="flex-grow-1">
                                    <Card.Title className="mb-1">Create New Product</Card.Title>
                                    <Card.Text className="text-muted small mb-0">
                                        List a new item for auction
                                    </Card.Text>
                                </div>
                                <Button as={Link} to="/seller/create-product" variant="success">
                                    Create
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} className="mb-3">
                    <Card className="shadow-sm h-100 border-0" style={{ borderLeft: "4px solid #0dcaf0" }}>
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <div className="fs-1 me-3">👤</div>
                                <div className="flex-grow-1">
                                    <Card.Title className="mb-1">My Profile</Card.Title>
                                    <Card.Text className="text-muted small mb-0">
                                        View and edit your seller profile
                                    </Card.Text>
                                </div>
                                <Button as={Link} to="/profile" variant="info">
                                    View
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Products List */}
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">My Products</h4>
                    <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={fetchProducts}
                        disabled={loading}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : "🔄 Refresh"}
                    </Button>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="mt-2 text-muted">Loading your products...</p>
                    </div>
                ) : products.length > 0 ? (
                    <>
                        {/* Desktop Table View */}
                        <div className="d-none d-md-block">
                            <Card>
                                <Card.Body className="p-0">
                                    <Table responsive hover className="mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Product</th>
                                                <th>Start Price</th>
                                                <th>Current Price</th>
                                                <th>Status</th>
                                                <th>End Time</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((product) => (
                                                <tr key={product.id}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <img 
                                                                src={getPrimaryImage(product)} 
                                                                alt={product.name}
                                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                                                className="me-3"
                                                            />
                                                            <div>
                                                                <strong>{product.name}</strong>
                                                                {!product.isApproved && <Badge bg="danger" className="ms-2">Not Approved</Badge>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{formatCurrency(product.startPrice)}</td>
                                                    <td>{formatCurrency(product.currentPrice)}</td>
                                                    <td>{getStatusBadge(product)}</td>
                                                    <td>
                                                        <small>{new Date(product.endTime).toLocaleString()}</small>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <Button
                                                                as={Link}
                                                                to={`/seller/products/${product.id}`}
                                                                size="sm"
                                                                variant="primary"
                                                            >
                                                                View
                                                            </Button>
                                                            {!product.isApproved && product.status === "Pending" && (
                                                                <Button
                                                                    as={Link}
                                                                    to={`/seller/products/${product.id}/edit`}
                                                                    size="sm"
                                                                    variant="warning"
                                                                >
                                                                    Edit
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </div>

                        {/* Mobile Card View */}
                        <div className="d-md-none">
                            <Row>
                                {products.map((product) => (
                                    <Col key={product.id} xs={12} className="mb-3">
                                        <Card className="shadow-sm">
                                            <Card.Img 
                                                variant="top" 
                                                src={getPrimaryImage(product)}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <Card.Title className="mb-0">{product.name}</Card.Title>
                                                    {getStatusBadge(product)}
                                                </div>
                                                {!product.isApproved && (
                                                    <Badge bg="danger" className="mb-2">Not Approved</Badge>
                                                )}
                                                <Card.Text className="small">
                                                    <strong>Start Price:</strong> {formatCurrency(product.startPrice)}<br />
                                                    <strong>Current:</strong> {formatCurrency(product.currentPrice)}<br />
                                                    <strong>Ends:</strong> {new Date(product.endTime).toLocaleString()}
                                                </Card.Text>
                                                <div className="d-flex gap-2">
                                                    <Button
                                                        as={Link}
                                                        to={`/seller/products/${product.id}`}
                                                        size="sm"
                                                        variant="primary"
                                                        className="flex-grow-1"
                                                    >
                                                        View Details
                                                    </Button>
                                                    {!product.isApproved && product.status === "Pending" && (
                                                        <Button
                                                            as={Link}
                                                            to={`/seller/products/${product.id}/edit`}
                                                            size="sm"
                                                            variant="warning"
                                                        >
                                                            Edit
                                                        </Button>
                                                    )}
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </>
                ) : (
                    <Alert variant="info" className="text-center">
                        <h5>No Products Yet</h5>
                        <p>You haven't listed any products yet. Click the button above to create your first auction!</p>
                        <Button as={Link} to="/seller/create-product" variant="success">
                            Create Your First Product
                        </Button>
                    </Alert>
                )}
            </div>
        </Container>
    );
};

export default SellerHome;
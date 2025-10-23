import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Alert,
  Spinner,
  Modal,
  Table,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { getImageUrl } from "../../utils/imageHelper";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/ProductsApi/${id}`);
      setProduct(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/ProductsApi/${id}`);
      setSuccess("Product deleted successfully");
      setTimeout(() => {
        navigate("/seller/home");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Failed to delete product");
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
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

  const isEditable = (product) => {
    return !product.isApproved && product.status === "Pending";
  };

  const isDeletable = (product) => {
    return product.status === "Pending" || product.status === "Expired";
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading product details...</p>
        </div>
      </Container>
    );
  }

  if (error && !product) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => navigate("/seller/home")}>Back to Dashboard</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5">
      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Button variant="outline-secondary" onClick={() => navigate("/seller/home")}>
            ← Back to Dashboard
          </Button>
        </div>
        <div className="d-flex gap-2">
          {isEditable(product) && (
            <Button
              variant="warning"
              onClick={() => navigate(`/seller/products/${id}/edit`)}
            >
              Edit Product
            </Button>
          )}
          {isDeletable(product) && (
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              Delete Product
            </Button>
          )}
        </div>
      </div>

      <Row>
        {/* Product Images */}
        <Col lg={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              {product.images && product.images.length > 0 ? (
                <>
                  {/* Primary Image */}
                  <div className="mb-3">
                    <img
                      src={getImageUrl(product.images.find(img => img.isPrimary)?.imageUrl || product.images[0].imageUrl)}
                      alt={product.name}
                      className="w-100"
                      style={{ maxHeight: "400px", objectFit: "contain", backgroundColor: "#f8f9fa" }}
                    />
                  </div>
                  {/* Thumbnail Images */}
                  {product.images.length > 1 && (
                    <Row>
                      {product.images.map((image, index) => (
                        <Col xs={3} key={image.id}>
                          <img
                            src={getImageUrl(image.imageUrl)}
                            alt={`${product.name} ${index + 1}`}
                            className="w-100"
                            style={{ 
                              height: "80px", 
                              objectFit: "cover", 
                              cursor: "pointer",
                              border: image.isPrimary ? "3px solid #0d6efd" : "1px solid #dee2e6",
                              borderRadius: "4px"
                            }}
                          />
                          {image.isPrimary && (
                            <Badge bg="primary" className="w-100 small mt-1">Primary</Badge>
                          )}
                        </Col>
                      ))}
                    </Row>
                  )}
                </>
              ) : (
                <div className="text-center py-5 text-muted">
                  <h5>No Images</h5>
                  <p>No images uploaded for this product</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Product Details */}
        <Col lg={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Product Information</h4>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h3>{product.name}</h3>
                <div className="mb-2">{getStatusBadge(product)}</div>
                {!product.isApproved && (
                  <Alert variant="warning" className="mb-3">
                    <strong>⏳ Pending Admin Approval</strong>
                    <p className="mb-0 small">
                      Your product is awaiting admin approval before it becomes visible to buyers.
                    </p>
                  </Alert>
                )}
              </div>

              <Table bordered className="mb-0">
                <tbody>
                  <tr>
                    <th style={{ width: "40%" }}>Product ID</th>
                    <td>{product.id}</td>
                  </tr>
                  <tr>
                    <th>Starting Price</th>
                    <td className="fw-bold text-success">{formatCurrency(product.startPrice)}</td>
                  </tr>
                  <tr>
                    <th>Current Price</th>
                    <td className="fw-bold text-primary">{formatCurrency(product.currentPrice)}</td>
                  </tr>
                  <tr>
                    <th>Min Bid Increment</th>
                    <td>{formatCurrency(product.minBidIncrement)}</td>
                  </tr>
                  <tr>
                    <th>Start Time</th>
                    <td>{new Date(product.startTime).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>End Time</th>
                    <td>{new Date(product.endTime).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>Created</th>
                    <td>{new Date(product.createdAt).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>Last Updated</th>
                    <td>{new Date(product.updatedAt).toLocaleString()}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Description */}
        <Col xs={12} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Description</h5>
            </Card.Header>
            <Card.Body>
              <p style={{ whiteSpace: "pre-wrap" }}>{product.description || "No description provided"}</p>
            </Card.Body>
          </Card>
        </Col>

        {/* Seller Information */}
        <Col lg={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Seller Information</h5>
            </Card.Header>
            <Card.Body>
              {product.seller ? (
                <div>
                  <p className="mb-1"><strong>Name:</strong> {product.seller.firstName} {product.seller.lastName}</p>
                  <p className="mb-0"><strong>Email:</strong> {product.seller.email}</p>
                </div>
              ) : (
                <p className="text-muted mb-0">Seller information not available</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Winner Information (if sold) */}
        {product.status === "Sold" && product.winner && (
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm border-success">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">Winner Information</h5>
              </Card.Header>
              <Card.Body>
                <p className="mb-1"><strong>Name:</strong> {product.winner.firstName} {product.winner.lastName}</p>
                <p className="mb-0"><strong>Email:</strong> {product.winner.email}</p>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <strong>⚠️ Warning:</strong> This action cannot be undone.
          </Alert>
          <p>Are you sure you want to delete this product?</p>
          <p><strong>{product.name}</strong></p>
          {product.currentPrice > product.startPrice && (
            <Alert variant="warning">
              This product has received bids and cannot be deleted.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              "Delete Product"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductDetail;

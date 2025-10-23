import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Badge,
  Modal,
  Alert,
  Spinner,
  Pagination,
  Tabs,
  Tab,
} from "react-bootstrap";
import api from "../../api/api";
import { getImageUrl } from "../../utils/imageHelper";

const ManageAuctions = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState("pending");
  
  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [deleteReason, setDeleteReason] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [currentPage, activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
      let endpoint = "/AdminApi/products";
      const params = {
        page: currentPage,
        limit: 10,
      };

      if (activeTab === "pending") {
        endpoint = "/AdminApi/products/pending";
      } else if (activeTab === "approved") {
        params.isApproved = true;
      } else if (activeTab === "active") {
        params.status = "Active";
        params.isApproved = true;
      } else if (activeTab === "sold") {
        params.status = "Sold";
      } else if (activeTab === "expired") {
        params.status = "Expired";
      }

      const response = await api.get(endpoint, { params });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setError("");
      const response = await api.put(`/AdminApi/products/${selectedProduct.id}/approve`, {});
      setSuccess(response.data.message);
      setShowApproveModal(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve product");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    try {
      setError("");
      const response = await api.put(`/AdminApi/products/${selectedProduct.id}/reject`, {
        reason: rejectReason,
      });
      setSuccess(response.data.message);
      setShowRejectModal(false);
      setRejectReason("");
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject product");
    }
  };

  const handleDelete = async () => {
    try {
      setError("");
      const response = await api.delete(`/AdminApi/products/${selectedProduct.id}/force-delete`, {
        data: {
          reason: deleteReason || "Administrative action",
        },
      });
      setSuccess(response.data.message);
      if (response.data.hadBids) {
        setSuccess(response.data.message + " All bidders have been notified.");
      }
      setShowDeleteModal(false);
      setDeleteReason("");
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  const openApproveModal = (product) => {
    setSelectedProduct(product);
    setShowApproveModal(true);
  };

  const openRejectModal = (product) => {
    setSelectedProduct(product);
    setShowRejectModal(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Manage Auctions</h2>

      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

      {/* Tabs for filtering */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => {
          setActiveTab(k);
          setCurrentPage(1);
        }}
        className="mb-3"
      >
        <Tab eventKey="pending" title={`Pending Approval`} />
        <Tab eventKey="approved" title="Approved" />
        <Tab eventKey="active" title="Active" />
        <Tab eventKey="sold" title="Sold" />
        <Tab eventKey="expired" title="Expired" />
        <Tab eventKey="all" title="All Products" />
      </Tabs>

      <div className="mb-3 text-muted">
        Total Products: {totalCount}
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : products.length === 0 ? (
        <Alert variant="info">No products found.</Alert>
      ) : (
        <>
          <Card>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Seller</th>
                    <th>Starting Price</th>
                    <th>Current Bid</th>
                    <th>Status</th>
                    <th>Approved</th>
                    <th>End Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>
                        <img 
                          src={
                            product.images && product.images.length > 0
                              ? getImageUrl(product.images[0].imageUrl)
                              : 'https://via.placeholder.com/60x60?text=No+Image'
                          }
                          alt={product.name}
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                      </td>
                      <td>
                        <strong>{product.name}</strong>
                        <br />
                        <small className="text-muted">{product.category}</small>
                      </td>
                      <td>
                        {product.seller?.firstName} {product.seller?.lastName}
                        <br />
                        <small className="text-muted">{product.seller?.email}</small>
                      </td>
                      <td>{formatCurrency(product.startingPrice)}</td>
                      <td>
                        {product.currentBid > 0 
                          ? formatCurrency(product.currentBid)
                          : "No bids"}
                      </td>
                      <td>
                        <Badge bg={getStatusBadgeVariant(product.status)}>
                          {product.status}
                        </Badge>
                      </td>
                      <td>
                        {product.isApproved ? (
                          <Badge bg="success">✓ Approved</Badge>
                        ) : (
                          <Badge bg="danger">✗ Not Approved</Badge>
                        )}
                      </td>
                      <td>
                        {new Date(product.auctionEndTime).toLocaleString()}
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-2">
                          {!product.isApproved && product.status === "Pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => openApproveModal(product)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="warning"
                                onClick={() => openRejectModal(product)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => openDeleteModal(product)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Approve Modal */}
      <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Approve Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <Alert variant="success">
                This product will be approved and made available for bidding.
              </Alert>
              <p><strong>Product:</strong> {selectedProduct.name}</p>
              <p><strong>Seller:</strong> {selectedProduct.seller?.firstName} {selectedProduct.seller?.lastName}</p>
              <p><strong>Starting Price:</strong> {formatCurrency(selectedProduct.startingPrice)}</p>
              <p><strong>End Date:</strong> {new Date(selectedProduct.auctionEndTime).toLocaleString()}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApproveModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleApprove}>
            Approve Product
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reject Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <Alert variant="warning">
                <strong>Warning:</strong> This product will be permanently deleted and the seller will be notified.
              </Alert>
              <p><strong>Product:</strong> {selectedProduct.name}</p>
              <p><strong>Seller:</strong> {selectedProduct.seller?.firstName} {selectedProduct.seller?.lastName}</p>
              <Form.Group className="mb-3">
                <Form.Label>Reason for Rejection *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter reason for rejection (will be sent to the seller)..."
                  required
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleReject}>
            Reject Product
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <Alert variant="danger">
                <strong>Warning:</strong> This action cannot be undone. The product will be permanently deleted.
                {selectedProduct.currentBid > 0 && (
                  <div className="mt-2">
                    <strong>Note:</strong> This product has active bids. All bidders will be notified of the cancellation.
                  </div>
                )}
              </Alert>
              <p><strong>Product:</strong> {selectedProduct.name}</p>
              <p><strong>Seller:</strong> {selectedProduct.seller?.firstName} {selectedProduct.seller?.lastName}</p>
              <p><strong>Status:</strong> <Badge bg={getStatusBadgeVariant(selectedProduct.status)}>{selectedProduct.status}</Badge></p>
              {selectedProduct.currentBid > 0 && (
                <p><strong>Current Bid:</strong> {formatCurrency(selectedProduct.currentBid)}</p>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Reason for Deletion (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Enter reason for deletion..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Product
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageAuctions;

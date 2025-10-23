import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Table, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import { getImageUrl } from "../../utils/imageHelper";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState("CreditCard");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/OrdersApi/buyer/${user.id}`);
      setOrders(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentClick = (order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
    // Pre-fill cardholder name
    setCardHolderName(`${user.firstName} ${user.lastName}`);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setProcessing(true);
      
      await api.post("/PaymentsApi/process", {
        orderId: selectedOrder.id,
        paymentMethod,
        cardNumber,
        cardHolderName,
        expiryDate,
        cvv
      });

      setSuccess("Payment processed successfully! Your order is confirmed.");
      setShowPaymentModal(false);
      
      // Reset form
      setCardNumber("");
      setExpiryDate("");
      setCvv("");
      
      // Refresh orders
      await fetchMyOrders();
      
      setTimeout(() => setSuccess(""), 5000);
    } catch (error) {
      console.error("Error processing payment:", error);
      setError(
        error.response?.data || "Payment failed. Please check your details and try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  const getOrderStatusBadge = (status) => {
    const statusMap = {
      Pending: "warning",
      Paid: "success",
      Shipped: "info",
      Delivered: "primary",
      Cancelled: "danger"
    };
    return statusMap[status] || "secondary";
  };

  const getPrimaryImage = (product) => {
    if (product?.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
      return getImageUrl(primaryImage.imageUrl);
    }
    return getImageUrl(null);
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your orders...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-bag-check me-2"></i>
          My Orders
        </h2>
        <Button variant="outline-primary" onClick={fetchMyOrders}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col xs={6} md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h3 className="mb-0">{orders.length}</h3>
              <small className="text-muted">Total Orders</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="text-center shadow-sm border-warning">
            <Card.Body>
              <h3 className="mb-0 text-warning">
                {orders.filter(o => o.status === "Pending").length}
              </h3>
              <small className="text-muted">Pending Payment</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="text-center shadow-sm border-success">
            <Card.Body>
              <h3 className="mb-0 text-success">
                {orders.filter(o => o.status === "Paid").length}
              </h3>
              <small className="text-muted">Paid</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="text-center shadow-sm border-info">
            <Card.Body>
              <h3 className="mb-0 text-info">
                {orders.filter(o => o.status === "Delivered").length}
              </h3>
              <small className="text-muted">Delivered</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Orders List */}
      <Card className="shadow-sm">
        <Card.Body>
          {orders.length === 0 ? (
            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              You haven't won any auctions yet. Keep bidding to win items!
              <br />
              <Link to="/buyer" className="alert-link">Browse active auctions</Link>
            </Alert>
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Order Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.id}</strong>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={getPrimaryImage(order.product)}
                          alt={order.product?.name}
                          style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
                          className="me-3"
                        />
                        <div>
                          <strong>{order.product?.name}</strong>
                          <br />
                          <small className="text-muted">
                            Seller: {order.product?.seller?.fullName}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong className="text-success">${order.totalAmount?.toFixed(2)}</strong>
                    </td>
                    <td>
                      <Badge bg={getOrderStatusBadge(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td>
                      <small>{new Date(order.createdAt).toLocaleDateString()}</small>
                    </td>
                    <td>
                      {order.status === "Pending" && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handlePaymentClick(order)}
                        >
                          <i className="bi bi-credit-card me-1"></i>
                          Pay Now
                        </Button>
                      )}
                      {order.status === "Paid" && (
                        <Badge bg="success">
                          <i className="bi bi-check-circle me-1"></i>
                          Payment Complete
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Complete Payment</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePayment}>
          <Modal.Body>
            {selectedOrder && (
              <>
                {/* Order Summary */}
                <Card className="mb-4 bg-light">
                  <Card.Body>
                    <h6>Order Summary</h6>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Product:</span>
                      <strong>{selectedOrder.product?.name}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Order #:</span>
                      <strong>#{selectedOrder.id}</strong>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <h5>Total Amount:</h5>
                      <h5 className="text-success">${selectedOrder.totalAmount?.toFixed(2)}</h5>
                    </div>
                  </Card.Body>
                </Card>

                {/* Payment Method */}
                <Form.Group className="mb-3">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  >
                    <option value="CreditCard">Credit Card</option>
                    <option value="DebitCard">Debit Card</option>
                    <option value="PayPal">PayPal</option>
                  </Form.Select>
                </Form.Group>

                {/* Card Details */}
                <Form.Group className="mb-3">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                    maxLength="16"
                    required
                    disabled={processing}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Cardholder Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="John Doe"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    required
                    disabled={processing}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Expiry Date</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        maxLength="5"
                        required
                        disabled={processing}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>CVV</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        maxLength="4"
                        required
                        disabled={processing}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {error && <Alert variant="danger">{error}</Alert>}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPaymentModal(false)} disabled={processing}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={processing}>
              {processing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : (
                <>
                  <i className="bi bi-credit-card me-2"></i>
                  Pay ${selectedOrder?.totalAmount?.toFixed(2)}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default MyOrders;

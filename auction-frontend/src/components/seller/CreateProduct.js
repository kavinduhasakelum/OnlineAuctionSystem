import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startPrice: "",
    minBidIncrement: "1.00",
    startTime: "",
    endTime: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 5) {
      setError("You can upload a maximum of 5 images");
      return;
    }

    // Validate file sizes and types
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image file`);
        return false;
      }
      return true;
    });

    setImages([...images, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.name || !formData.description || !formData.startPrice) {
      setError("Please fill in all required fields");
      return;
    }

    if (parseFloat(formData.startPrice) <= 0) {
      setError("Start price must be greater than 0");
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      setError("Please select start and end times");
      return;
    }

    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);
    const now = new Date();

    if (startTime < now) {
      setError("Start time must be in the future");
      return;
    }

    if (endTime <= startTime) {
      setError("End time must be after start time");
      return;
    }

    if (images.length === 0) {
      setError("Please upload at least one product image");
      return;
    }

    try {
      setLoading(true);

      // Create FormData
      const data = new FormData();
      data.append("Name", formData.name);
      data.append("Description", formData.description);
      data.append("StartPrice", formData.startPrice);
      data.append("MinBidIncrement", formData.minBidIncrement || "1.00");
      data.append("StartTime", new Date(formData.startTime).toISOString());
      data.append("EndTime", new Date(formData.endTime).toISOString());

      // Append images
      images.forEach((image) => {
        data.append("Images", image);
      });

      const response = await api.post("/ProductsApi", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Product created successfully! Awaiting admin approval.");
      setTimeout(() => {
        navigate("/seller/home");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  // Set default times (now and 7 days from now)
  React.useEffect(() => {
    const now = new Date();
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const formatDateTime = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    setFormData(prev => ({
      ...prev,
      startTime: formatDateTime(now),
      endTime: formatDateTime(weekLater)
    }));
  }, []);

  return (
    <Container className="mt-4 mb-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow">
            <Card.Header className="bg-success text-white">
              <h3 className="mb-0">Create New Product</h3>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert
                  variant="danger"
                  onClose={() => setError("")}
                  dismissible
                >
                  {error}
                </Alert>
              )}
              {success && (
                <Alert
                  variant="success"
                  onClose={() => setSuccess("")}
                  dismissible
                >
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Product Name */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Product Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </Form.Group>

                {/* Description */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Description <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide a detailed description of your product"
                    required
                  />
                  <Form.Text className="text-muted">
                    Include condition, features, and any relevant details
                  </Form.Text>
                </Form.Group>

                {/* Price Information */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Starting Price (USD) <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        min="0.01"
                        name="startPrice"
                        value={formData.startPrice}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Minimum Bid Increment (USD)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        min="0.01"
                        name="minBidIncrement"
                        value={formData.minBidIncrement}
                        onChange={handleChange}
                        placeholder="1.00"
                      />
                      <Form.Text className="text-muted">
                        Default: $1.00
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Auction Times */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Start Time <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        End Time <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Image Upload */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Product Images <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={images.length >= 5}
                  />
                  <Form.Text className="text-muted">
                    Upload up to 5 images. Maximum 5MB per image. First image will be the primary image.
                  </Form.Text>
                </Form.Group>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mb-3">
                    <Form.Label>Image Previews:</Form.Label>
                    <Row>
                      {imagePreviews.map((preview, index) => (
                        <Col xs={6} md={4} lg={3} key={index} className="mb-3">
                          <Card>
                            <Card.Img
                              variant="top"
                              src={preview}
                              style={{ height: "150px", objectFit: "cover" }}
                            />
                            <Card.Body className="p-2">
                              <div className="d-flex justify-content-between align-items-center">
                                {index === 0 && (
                                  <Badge bg="primary" className="small">
                                    Primary
                                  </Badge>
                                )}
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => removeImage(index)}
                                  className="ms-auto"
                                >
                                  Remove
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {/* Info Alert */}
                <Alert variant="info">
                  <strong>ℹ️ Note:</strong> Your product will be submitted for admin approval before it becomes visible to buyers.
                </Alert>

                {/* Submit Buttons */}
                <div className="d-flex gap-2 justify-content-end">
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/seller/home")}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="success"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Creating...
                      </>
                    ) : (
                      "Create Product"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateProduct;
